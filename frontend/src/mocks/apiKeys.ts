export const MOCK_KEYS = [
  { id: 1, name: 'Production Key', key: 'cpk_live_sk_aBcDeFgH1234567890XyZ', created: '01/03/2026', lastUsed: '23/03/2026', calls: 1247, status: 'active', permissions: ['generate', 'templates', 'history'] },
  { id: 2, name: 'Development Key', key: 'cpk_test_sk_QwErTyUi0987654321AbC', created: '15/02/2026', lastUsed: '20/03/2026', calls: 340, status: 'active', permissions: ['generate'] },
];

export const MOCK_LOGS = [
  { id: 1, endpoint: 'POST /api/v1/generate', model: 'gpt-4o', status: 200, latency: '1.2s', time: '23/03 14:30:22', tokens: 450, industry: 'ecommerce' },
  { id: 2, endpoint: 'GET /api/v1/templates', model: '-', status: 200, latency: '0.3s', time: '23/03 14:28:15', tokens: 0, industry: '-' },
  { id: 3, endpoint: 'POST /api/v1/generate', model: 'llama-3.1-70b', status: 200, latency: '2.1s', time: '23/03 11:20:05', tokens: 520, industry: 'realestate' },
  { id: 4, endpoint: 'POST /api/v1/generate', model: 'gpt-4o', status: 429, latency: '-', time: '22/03 18:45:33', tokens: 0, industry: 'technology' },
  { id: 5, endpoint: 'POST /api/v1/fine-tune/apply', model: 'finetuned-v2', status: 200, latency: '1.8s', time: '22/03 09:12:00', tokens: 380, industry: 'fnb' },
];

export const CODE_SAMPLES: Record<string, string> = {
  python: `import requests

API_KEY = "cpk_live_sk_aBcDeFgH..."
BASE_URL = "https://api.copypro.vn/v1"

def generate_copy(industry, copy_type, product_name, tone="professional"):
    response = requests.post(
        f"{BASE_URL}/generate",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={
            "industry": industry,        # "ecommerce", "realestate", ...
            "type": copy_type,           # "headline", "description", "cta", "social"
            "product_name": product_name,
            "tone": tone,                # "professional", "friendly", "urgent"
            "model": "gpt-4o",          # "gpt-4o", "llama-3.1-70b", "finetuned"
            "variations": 3,            # Number of variations to generate
            "language": "vi"            # "vi" or "en"
        }
    )
    return response.json()

# Example usage
result = generate_copy("ecommerce", "headline", "Áo thun cotton premium", "urgent")
print(result)
# {
#   "id": "copy_abc123",
#   "variations": [...],
#   "tokens_used": 450,
#   "model": "gpt-4o",
#   "quality_score": 92
# }`,

  javascript: `const axios = require('axios');

const API_KEY = 'cpk_live_sk_aBcDeFgH...';
const BASE_URL = 'https://api.copypro.vn/v1';

async function generateCopy({ industry, type, productName, tone = 'professional' }) {
  const { data } = await axios.post(\`\${BASE_URL}/generate\`, {
    industry,
    type,
    product_name: productName,
    tone,
    model: 'gpt-4o',
    variations: 3,
    language: 'vi',
  }, {
    headers: { Authorization: \`Bearer \${API_KEY}\` }
  });
  return data;
}

// Usage
generateCopy({
  industry: 'ecommerce',
  type: 'headline',
  productName: 'Áo thun cotton premium',
  tone: 'urgent',
}).then(result => console.log(result));`,

  curl: `curl -X POST https://api.copypro.vn/v1/generate \\
  -H "Authorization: Bearer cpk_live_sk_aBcDeFgH..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "industry": "ecommerce",
    "type": "headline",
    "product_name": "Áo thun cotton premium",
    "tone": "urgent",
    "model": "gpt-4o",
    "variations": 3,
    "language": "vi"
  }'

# Response:
# {
#   "id": "copy_abc123",
#   "variations": [
#     "FLASH SALE! Áo Thun Cotton Premium - Giảm 50% Chỉ Hôm Nay",
#     "Áo Thun Premium Cháy Hàng Mọi Mùa - Order Ngay Kẻo Lỡ!",
#     "🔥 Áo Cotton Cao Cấp - 2 Mua 1 Tặng 1 - Hôm Nay Thôi!"
#   ],
#   "tokens_used": 450,
#   "model": "gpt-4o",
#   "quality_score": 92
# }`,

  php: `<?php
$apiKey = 'cpk_live_sk_aBcDeFgH...';
$baseUrl = 'https://api.copypro.vn/v1';

function generateCopy($industry, $type, $productName, $tone = 'professional') {
    global $apiKey, $baseUrl;

    $ch = curl_init("$baseUrl/generate");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'industry' => $industry,
        'type' => $type,
        'product_name' => $productName,
        'tone' => $tone,
        'model' => 'gpt-4o',
        'variations' => 3,
        'language' => 'vi'
    ]));

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

$result = generateCopy('ecommerce', 'headline', 'Áo thun cotton premium', 'urgent');
print_r($result);`,
};
