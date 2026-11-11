import Anthropic from '@anthropic-ai/sdk';

// Hàm máy chủ trên Vercel: xác thực người dùng Supabase, gửi hội thoại tới Claude
// và trả câu trả lời về trình duyệt dạng văn bản stream.
// Biến môi trường cần có trên Vercel: ANTHROPIC_API_KEY (bí mật, không có tiền tố VITE_),
// VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY (dùng chung với giao diện).

const MODEL = 'claude-opus-5-5';
const MAX_MESSAGES = 40;
const MAX_CHARS = 150000;

const SYSTEM = `Bạn là trợ lý AI của ứng dụng ANVI – Phát triển bản thân theo ba trụ cột Thân – Tâm – Tuệ, đóng vai một huấn luyện viên phát triển bản thân: phân tích sắc sảo, ấm áp, thẳng thắn và thực tế.
- Luôn trả lời bằng tiếng Việt, súc tích.
- Định dạng bằng markdown đơn giản: tiêu đề "##", gạch đầu dòng "-", chữ đậm "**". Không dùng bảng.
- Chỉ dựa trên dữ liệu người dùng đưa ra trong cuộc trò chuyện; không bịa thêm sự kiện. Nếu dữ liệu mỏng, hãy nói rõ.
- Khi gợi ý hành động, viết cụ thể và đo được.`;

let client;

async function verifyUser(token) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!token || !url || !key) return false;
  const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: key },
  });
  return r.ok;
}

function cleanMessages(input) {
  if (!Array.isArray(input) || !input.length || input.length > MAX_MESSAGES) return null;
  const out = [];
  let total = 0;
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const content = m.content.trim();
    if (!content) continue;
    total += content.length;
    out.push({ role: m.role, content });
  }
  if (!out.length || total > MAX_CHARS || out[0].role !== 'user' || out.at(-1).role !== 'user') return null;
  return out;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'ai_not_configured' });

  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!(await verifyUser(token))) return res.status(401).json({ error: 'unauthorized' });

  const messages = cleanMessages(readBody(req)?.messages);
  if (!messages) return res.status(400).json({ error: 'bad_request' });

  // fallbacks "default": nếu mô hình từ chối vì bộ lọc an toàn, máy chủ Anthropic tự chạy lại trên mô hình dự phòng
  client ??= new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    system: SYSTEM,
    messages,
    output_config: { effort: 'medium' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  });
  res.on('close', () => { if (!res.writableEnded) stream.abort(); });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') res.write(event.delta.text);
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') res.write('\n\n⚠️ AI không thể trả lời yêu cầu này.');
    else if (final.stop_reason === 'max_tokens') res.write('\n\n⚠️ Câu trả lời đã bị cắt ngắn.');
  } catch (err) {
    if (err instanceof Anthropic.APIUserAbortError) return;
    console.error('AI error', err);
    if (!res.headersSent) {
      if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'rate_limited' });
      if (err instanceof Anthropic.AuthenticationError) return res.status(503).json({ error: 'ai_not_configured' });
      return res.status(502).json({ error: 'ai_error' });
    }
    res.write('\n\n⚠️ Có lỗi khi tạo câu trả lời, hãy thử lại.');
  }
  res.end();
}
