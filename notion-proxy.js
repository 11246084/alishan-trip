export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // 把 Worker 的路徑直接轉發到 Notion API
    const url = new URL(request.url);
    const notionUrl = 'https://api.notion.com' + url.pathname + url.search;

    const body = (request.method !== 'GET') ? await request.text() : undefined;

    const notionRes = await fetch(notionUrl, {
      method: request.method,
      headers: {
        'Authorization': 'Bearer ' + env.NOTION_TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: body || undefined,
    });

    const data = await notionRes.text();

    return new Response(data, {
      status: notionRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};
