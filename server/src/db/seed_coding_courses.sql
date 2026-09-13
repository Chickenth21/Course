-- ====================================================================
-- Seed: Coding Courses — ES6/7 JavaScript & Node.js
-- Dùng hardcoded UUID để tránh lỗi PL/pgSQL trong Supabase SQL Editor
-- ====================================================================

-- Mở rộng cột level để chứa 'intermediate' (12 ký tự)
ALTER TABLE public.courses ALTER COLUMN level TYPE VARCHAR(20);
ALTER TABLE public.lessons ALTER COLUMN level TYPE VARCHAR(20);

-- ============================================================
-- 1. COURSES
-- ============================================================
INSERT INTO public.courses (id, title, description, level, category, order_index, is_published)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'JavaScript ES6/7 Hiện Đại',
    'Nắm vững JavaScript hiện đại với ES6+: arrow functions, destructuring, async/await, modules và nhiều hơn nữa. Nền tảng bắt buộc cho mọi lập trình viên web.',
    'beginner', 'coding', 10, true
  ),
  (
    'a2000000-0000-0000-0000-000000000002',
    'Node.js Từ Cơ Bản Đến Nâng Cao',
    'Xây dựng backend API mạnh mẽ với Node.js, Express, xác thực JWT và tích hợp database. Học theo dự án thực tế.',
    'intermediate', 'coding', 11, true
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. ES6 MODULES
-- ============================================================
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES
  ('b1010000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Biến & Hàm Hiện Đại',    'let/const, arrow functions, template literals và default parameters', 1),
  ('b1020000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Destructuring & Spread', 'Trích xuất dữ liệu từ arrays/objects, rest/spread operators', 2),
  ('b1030000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Bất Đồng Bộ (Async)',    'Callbacks, Promises, async/await — làm chủ lập trình bất đồng bộ', 3),
  ('b1040000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Modules & Classes',      'ES Modules (import/export), class syntax và OOP trong JavaScript', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. NODE.JS MODULES
-- ============================================================
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES
  ('b2010000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'Node.js Core & NPM',          'Hệ sinh thái Node.js, modules tích hợp, NPM và quản lý packages', 1),
  ('b2020000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'Express.js REST API',         'Xây dựng RESTful API với Express: routing, middleware, CRUD', 2),
  ('b2030000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000002', 'Database & Authentication',   'Kết nối PostgreSQL/Supabase, xác thực JWT, bảo vệ routes', 3),
  ('b2040000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000002', 'Best Practices & Deployment', 'Error handling, env variables, logging và deploy lên production', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. ES6 LESSONS — Module 1: Biến & Hàm Hiện Đại
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c1010100-0000-0000-0000-000000000001',
  'b1010000-0000-0000-0000-000000000001',
  'let, const và Block Scope',
  'Hiểu sự khác biệt giữa var, let, const và tầm quan trọng của block scope',
  '["Phân biệt var/let/const", "Hiểu hoisting", "Viết code tránh lỗi scope"]',
  '{
    "explanation": "## let, const và Block Scope\n\n### Vấn đề với var\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n  // In ra 3, 3, 3 — Bug!\n}\n```\n\n### Giải pháp với let\n```javascript\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n  // In ra 0, 1, 2 — Đúng!\n}\n```\n\n### const — Hằng số\n```javascript\nconst PI = 3.14159;\nconst user = { name: \"Nam\" };\nuser.name = \"Lan\"; // OK — thay đổi property\n// user = {}; // TypeError — không thể reassign\n```\n\n### Quy tắc vàng\n- Dùng `const` mặc định\n- Dùng `let` khi cần thay đổi giá trị\n- Không bao giờ dùng `var`",
    "examples": [
      {"code": "const MAX = 100;\nlet count = 0;\ncount++;\nconsole.log(count, MAX);", "output": "1 100"},
      {"code": "{\n  let blockVar = \"inside\";\n  console.log(blockVar);\n}\n// blockVar is not defined here", "output": "inside"}
    ],
    "vocabulary": ["block scope", "hoisting", "temporal dead zone", "immutability"]
  }',
  'beginner', 20, 'javascript', 1
),
(
  'c1010200-0000-0000-0000-000000000002',
  'b1010000-0000-0000-0000-000000000001',
  'Arrow Functions',
  'Cú pháp ngắn gọn, this binding và khi nào nên dùng arrow function',
  '["Viết arrow function đúng cú pháp", "Hiểu this trong arrow function", "Phân biệt khi nào dùng arrow vs regular"]',
  '{
    "explanation": "## Arrow Functions\n\n### Cú pháp\n```javascript\n// Traditional\nfunction add(a, b) { return a + b; }\n\n// Arrow function\nconst add = (a, b) => a + b;\n\n// Một tham số — bỏ dấu ()\nconst double = n => n * 2;\n\n// Nhiều dòng — cần {} và return\nconst calculate = (a, b) => {\n  const sum = a + b;\n  return sum * 2;\n};\n```\n\n### this trong Arrow Function\n```javascript\nconst timer = {\n  seconds: 0,\n  start() {\n    setInterval(() => {\n      this.seconds++; // Arrow kế thừa this từ start()\n      console.log(this.seconds);\n    }, 1000);\n  }\n};\ntimer.start(); // 1, 2, 3...\n```",
    "examples": [
      {"code": "const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);", "output": "[2, 4, 6, 8, 10]"},
      {"code": "const greet = name => `Hello, ${name}!`;\nconsole.log(greet(\"World\"));", "output": "Hello, World!"}
    ],
    "vocabulary": ["arrow function", "implicit return", "this binding", "lexical scope"]
  }',
  'beginner', 25, 'javascript', 2
),
(
  'c1010300-0000-0000-0000-000000000003',
  'b1010000-0000-0000-0000-000000000001',
  'Template Literals',
  'Chuỗi nhiều dòng, interpolation và tagged templates nâng cao',
  '["Dùng template literals thay string concatenation", "Viết chuỗi nhiều dòng", "Hiểu tagged templates cơ bản"]',
  '{
    "explanation": "## Template Literals\n\n### Interpolation\n```javascript\nconst name = \"Minh\";\nconst age = 25;\n// Cũ:\nconst msg1 = \"Tên: \" + name + \", Tuổi: \" + age;\n// Mới:\nconst msg2 = `Tên: ${name}, Tuổi: ${age}`;\n```\n\n### Biểu thức trong ${}\n```javascript\nconst a = 10, b = 20;\nconsole.log(`${a} + ${b} = ${a + b}`);\nconsole.log(`${age >= 18 ? \"Người lớn\" : \"Trẻ em\"}`);\n```\n\n### Chuỗi nhiều dòng\n```javascript\nconst html = `\n  <div class=\"card\">\n    <h2>${name}</h2>\n    <p>Tuổi: ${age}</p>\n  </div>\n`;\n```",
    "examples": [
      {"code": "const items = [\"Táo\", \"Cam\", \"Xoài\"];\nconsole.log(`Giỏ hàng: ${items.join(\", \")}\\nTổng: ${items.length} món`);", "output": "Giỏ hàng: Táo, Cam, Xoài\nTổng: 3 món"}
    ],
    "vocabulary": ["template literal", "interpolation", "tagged template", "multi-line string"]
  }',
  'beginner', 20, 'javascript', 3
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ES6 LESSONS — Module 2: Destructuring & Spread
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c1020100-0000-0000-0000-000000000004',
  'b1020000-0000-0000-0000-000000000002',
  'Object & Array Destructuring',
  'Trích xuất dữ liệu từ objects và arrays một cách gọn gàng',
  '["Destructure objects với alias và default value", "Destructure arrays và nested data", "Dùng destructuring trong function params"]',
  '{
    "explanation": "## Destructuring\n\n### Object Destructuring\n```javascript\nconst user = { name: \"An\", age: 28, role: \"admin\" };\n\n// Destructuring\nconst { name, age } = user;\n\n// Alias (đổi tên)\nconst { name: userName, role: userRole = \"guest\" } = user;\nconsole.log(userName, userRole); // \"An\" \"admin\"\n```\n\n### Array Destructuring\n```javascript\nconst colors = [\"red\", \"green\", \"blue\"];\nconst [first, second] = colors;\nconst [, , third] = colors; // Bỏ qua phần tử\nconsole.log(first, third); // \"red\" \"blue\"\n```\n\n### Trong Function Params\n```javascript\nfunction displayUser({ name, age, role = \"user\" }) {\n  return `${name} (${age}) — ${role}`;\n}\nconsole.log(displayUser(user)); // \"An (28) — admin\"\n```",
    "examples": [
      {"code": "const [a, b, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(a, b, rest);", "output": "1 2 [3, 4, 5]"},
      {"code": "const { x: { y } } = { x: { y: 42 } };\nconsole.log(y);", "output": "42"}
    ],
    "vocabulary": ["destructuring", "alias", "default value", "nested destructuring"]
  }',
  'beginner', 25, 'javascript', 1
),
(
  'c1020200-0000-0000-0000-000000000005',
  'b1020000-0000-0000-0000-000000000002',
  'Spread & Rest Operators',
  'Sao chép, kết hợp arrays/objects và thu thập arguments',
  '["Dùng spread để copy và merge", "Dùng rest để thu thập tham số", "Phân biệt spread vs rest"]',
  '{
    "explanation": "## Spread (...) và Rest (...)\n\n### Spread — Trải ra\n```javascript\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst merged = [...arr1, ...arr2];\n\nconst defaults = { theme: \"dark\", lang: \"vi\" };\nconst user = { ...defaults, name: \"Lan\", lang: \"en\" };\n// { theme: \"dark\", lang: \"en\", name: \"Lan\" }\n```\n\n### Rest — Gom lại\n```javascript\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nsum(1, 2, 3, 4, 5); // 15\n\nconst { id, ...rest } = user;\n```",
    "examples": [
      {"code": "const nums = [3, 1, 4, 1, 5, 9];\nconsole.log(Math.max(...nums));", "output": "9"},
      {"code": "function log(level, ...messages) {\n  console.log(`[${level}]`, messages.join(\" \"));\n}\nlog(\"INFO\", \"Server\", \"started\");", "output": "[INFO] Server started"}
    ],
    "vocabulary": ["spread operator", "rest parameter", "shallow copy", "variadic function"]
  }',
  'beginner', 25, 'javascript', 2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ES6 LESSONS — Module 3: Async
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c1030100-0000-0000-0000-000000000006',
  'b1030000-0000-0000-0000-000000000003',
  'Promises — Giải Quyết Callback Hell',
  'Hiểu Promise và cách chain các tác vụ bất đồng bộ',
  '["Tạo và dùng Promise", "Chain với .then() và .catch()", "Promise.all và Promise.race"]',
  '{
    "explanation": "## Promises\n\n### Vấn đề: Callback Hell\n```javascript\ngetUser(id, function(user) {\n  getOrders(user.id, function(orders) {\n    getDetails(orders[0].id, function(detail) {\n      // Pyramid of doom!\n    });\n  });\n});\n```\n\n### Giải pháp: Promise\n```javascript\nconst fetchUser = (id) => new Promise((resolve, reject) => {\n  setTimeout(() => {\n    if (id > 0) resolve({ id, name: \"Nam\" });\n    else reject(new Error(\"Invalid ID\"));\n  }, 1000);\n});\n\nfetchUser(1)\n  .then(user => { console.log(user.name); return user; })\n  .catch(err => console.error(err.message));\n```\n\n### Promise.all — Chạy song song\n```javascript\nconst [users, products] = await Promise.all([\n  fetchUsers(),\n  fetchProducts()\n]);\n```",
    "examples": [
      {"code": "const p = Promise.resolve(42);\np.then(v => console.log(\"Value:\", v));", "output": "Value: 42"},
      {"code": "Promise.all([Promise.resolve(1), Promise.resolve(2)])\n  .then(values => console.log(values));", "output": "[1, 2]"}
    ],
    "vocabulary": ["Promise", "resolve", "reject", "then", "catch", "Promise.all"]
  }',
  'intermediate', 30, 'javascript', 1
),
(
  'c1030200-0000-0000-0000-000000000007',
  'b1030000-0000-0000-0000-000000000003',
  'Async/Await — Lập Trình Bất Đồng Bộ Hiện Đại',
  'Viết async code trông như sync code với async/await',
  '["Chuyển Promise chain sang async/await", "Xử lý lỗi với try/catch", "Tránh anti-patterns phổ biến"]',
  '{
    "explanation": "## Async/Await\n\n### Cú pháp cơ bản\n```javascript\nasync function fetchUserData(userId) {\n  try {\n    const user = await fetchUser(userId);\n    const orders = await fetchOrders(user.id);\n    return { user, orders };\n  } catch (error) {\n    console.error(\"Lỗi:\", error.message);\n    throw error;\n  }\n}\n```\n\n### Anti-pattern: await trong loop\n```javascript\n// Chậm — chạy tuần tự\nfor (const id of ids) {\n  const item = await fetchItem(id);\n}\n\n// Nhanh — chạy song song\nconst items = await Promise.all(ids.map(id => fetchItem(id)));\n```",
    "examples": [
      {"code": "async function delay(ms) {\n  return new Promise(r => setTimeout(r, ms));\n}\nasync function main() {\n  console.log(\"Bắt đầu\");\n  await delay(500);\n  console.log(\"Sau delay\");\n}\nmain();", "output": "Bắt đầu\nSau delay"}
    ],
    "vocabulary": ["async", "await", "try/catch", "sequential vs parallel"]
  }',
  'intermediate', 30, 'javascript', 2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ES6 LESSONS — Module 4: Modules & Classes
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c1040100-0000-0000-0000-000000000008',
  'b1040000-0000-0000-0000-000000000004',
  'ES Modules — import & export',
  'Tổ chức code với ES Modules: named exports, default exports',
  '["Dùng named và default export", "Import nhiều cách khác nhau", "Hiểu module scope"]',
  '{
    "explanation": "## ES Modules\n\n### Named Exports\n```javascript\n// math.js\nexport const PI = 3.14159;\nexport function add(a, b) { return a + b; }\nexport function multiply(a, b) { return a * b; }\n\n// main.js\nimport { PI, add } from \"./math.js\";\nimport { multiply as mul } from \"./math.js\";\nimport * as MathUtils from \"./math.js\";\n```\n\n### Default Export\n```javascript\n// user.js\nexport default class User {\n  constructor(name) { this.name = name; }\n}\n\n// main.js\nimport User from \"./user.js\";\nconst u = new User(\"An\");\n```",
    "examples": [
      {"code": "const utils = {\n  capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1)\n};\nconst { capitalize } = utils;\nconsole.log(capitalize(\"hello world\"));", "output": "Hello world"}
    ],
    "vocabulary": ["named export", "default export", "import", "module scope", "barrel file"]
  }',
  'intermediate', 25, 'javascript', 1
),
(
  'c1040200-0000-0000-0000-000000000009',
  'b1040000-0000-0000-0000-000000000004',
  'Classes & OOP trong JavaScript',
  'Class syntax, constructor, inheritance và encapsulation',
  '["Tạo class với constructor và methods", "Kế thừa với extends", "Dùng getter/setter và static methods"]',
  '{
    "explanation": "## Classes trong ES6\n\n### Khai báo Class\n```javascript\nclass Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  \n  speak() {\n    return `${this.name} nói: ${this.sound}!`;\n  }\n  \n  static create(name, sound) {\n    return new Animal(name, sound);\n  }\n}\n```\n\n### Kế thừa\n```javascript\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, \"Gâu gâu\");\n  }\n  fetch(item) {\n    return `${this.name} đã lấy ${item}!`;\n  }\n}\n\nconst dog = new Dog(\"Buddy\");\nconsole.log(dog.speak());\nconsole.log(dog instanceof Animal); // true\n```",
    "examples": [
      {"code": "class Stack {\n  #items = [];\n  push(item) { this.#items.push(item); }\n  pop() { return this.#items.pop(); }\n  get size() { return this.#items.length; }\n}\nconst s = new Stack();\ns.push(1); s.push(2); s.push(3);\nconsole.log(s.size, s.pop());", "output": "3 3"}
    ],
    "vocabulary": ["class", "constructor", "extends", "super", "getter", "setter", "static"]
  }',
  'intermediate', 30, 'javascript', 2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. NODE.JS LESSONS — Module 1: Node Core
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c2010100-0000-0000-0000-000000000010',
  'b2010000-0000-0000-0000-000000000001',
  'Node.js là gì & Cách hoạt động',
  'V8 engine, event loop, non-blocking I/O và khi nào dùng Node.js',
  '["Hiểu event loop của Node.js", "Phân biệt blocking vs non-blocking", "Biết khi nào dùng Node.js"]',
  '{
    "explanation": "## Node.js — JavaScript phía Server\n\n### Node.js là gì?\nNode.js là runtime chạy JavaScript bên ngoài browser, dùng V8 engine của Chrome và kiến trúc **event-driven, non-blocking I/O**.\n\n### Blocking vs Non-blocking\n```javascript\n// Blocking — Chặn toàn bộ server\nconst data = fs.readFileSync(\"file.txt\");\nconsole.log(\"Xong\");\n\n// Non-blocking — Server vẫn phục vụ request khác\nfs.readFile(\"file.txt\", (err, data) => {\n  console.log(\"Đọc xong:\", data.length, \"bytes\");\n});\nconsole.log(\"Tiếp tục ngay!\"); // In trước\n```",
    "examples": [
      {"code": "console.log(\"1 - Sync\");\nsetTimeout(() => console.log(\"3 - Timeout\"), 0);\nPromise.resolve().then(() => console.log(\"2 - Microtask\"));\nconsole.log(\"1.5 - Sync\");", "output": "1 - Sync\n1.5 - Sync\n2 - Microtask\n3 - Timeout"}
    ],
    "vocabulary": ["event loop", "V8 engine", "non-blocking I/O", "single-threaded", "callback queue"]
  }',
  'intermediate', 25, 'nodejs', 1
),
(
  'c2010200-0000-0000-0000-000000000011',
  'b2010000-0000-0000-0000-000000000001',
  'Built-in Modules: fs, path, http',
  'Làm việc với file system, đường dẫn và tạo HTTP server thuần',
  '["Đọc/ghi file với fs", "Xử lý đường dẫn với path", "Tạo HTTP server cơ bản"]',
  '{
    "explanation": "## Các Module Tích Hợp của Node.js\n\n### fs — File System\n```javascript\nimport fs from \"fs/promises\";\n\nconst content = await fs.readFile(\"data.txt\", \"utf-8\");\nawait fs.writeFile(\"output.txt\", \"Hello Node!\");\n```\n\n### path — Xử lý đường dẫn\n```javascript\nimport path from \"path\";\n\nconst filePath = path.join(\"data\", \"users.json\");\nconsole.log(path.extname(\"index.html\")); // \".html\"\nconsole.log(path.basename(\"/home/user/file.txt\")); // \"file.txt\"\n```\n\n### http — HTTP Server\n```javascript\nimport http from \"http\";\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { \"Content-Type\": \"application/json\" });\n  res.end(JSON.stringify({ message: \"Hello!\", url: req.url }));\n});\nserver.listen(3000, () => console.log(\"Server trên port 3000\"));\n```",
    "examples": [],
    "vocabulary": ["fs", "path", "http", "Buffer", "stream"]
  }',
  'intermediate', 30, 'nodejs', 2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NODE.JS LESSONS — Module 2: Express
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c2020100-0000-0000-0000-000000000012',
  'b2020000-0000-0000-0000-000000000002',
  'Express.js — Routing & Middleware',
  'Tạo REST API với Express: routes, middleware chain và error handling',
  '["Tạo Express app với routing", "Hiểu middleware pipeline", "Xử lý lỗi tập trung"]',
  '{
    "explanation": "## Express.js\n\n### Setup cơ bản\n```javascript\nimport express from \"express\";\nconst app = express();\napp.use(express.json());\n\napp.get(\"/api/users\", async (req, res) => {\n  const users = await getUsers();\n  res.json({ success: true, data: users });\n});\n\napp.listen(3000);\n```\n\n### Middleware\n```javascript\nconst logger = (req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next(); // Quan trọng!\n};\napp.use(logger);\n\n// Error handler (4 tham số)\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});\n```",
    "examples": [],
    "vocabulary": ["middleware", "routing", "req.body", "req.params", "req.query", "next()"]
  }',
  'intermediate', 35, 'nodejs', 1
),
(
  'c2020200-0000-0000-0000-000000000013',
  'b2020000-0000-0000-0000-000000000002',
  'REST API CRUD với Express',
  'Xây dựng API đầy đủ CRUD cho một resource',
  '["Thiết kế RESTful endpoints", "Xử lý query params và body", "Validation và error responses"]',
  '{
    "explanation": "## REST API CRUD\n\n### Quy ước REST\n| Method | URL | Action |\n|--------|-----|--------|\n| GET | /api/products | Lấy danh sách |\n| GET | /api/products/:id | Lấy 1 sản phẩm |\n| POST | /api/products | Tạo mới |\n| PUT | /api/products/:id | Cập nhật |\n| DELETE | /api/products/:id | Xóa |\n\n### Router Module\n```javascript\nimport { Router } from \"express\";\nconst router = Router();\nlet products = [];\n\nrouter.get(\"/\", (req, res) => {\n  const { search, limit = 10 } = req.query;\n  let result = products;\n  if (search) result = result.filter(p => p.name.includes(search));\n  res.json({ data: result.slice(0, Number(limit)) });\n});\n\nrouter.get(\"/:id\", (req, res) => {\n  const product = products.find(p => p.id === req.params.id);\n  if (!product) return res.status(404).json({ error: \"Not found\" });\n  res.json({ data: product });\n});\n\nexport default router;\n```",
    "examples": [],
    "vocabulary": ["CRUD", "RESTful", "Router", "req.params", "status codes"]
  }',
  'intermediate', 35, 'nodejs', 2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NODE.JS LESSONS — Module 3: Auth
-- ============================================================
INSERT INTO public.lessons (id, module_id, title, description, objectives, content, level, duration_minutes, language, order_index)
VALUES
(
  'c2030100-0000-0000-0000-000000000014',
  'b2030000-0000-0000-0000-000000000003',
  'JWT Authentication',
  'Xác thực người dùng với JSON Web Tokens: sign, verify, protect routes',
  '["Hiểu cấu trúc JWT", "Tạo và verify token", "Bảo vệ route với middleware auth"]',
  '{
    "explanation": "## JSON Web Token (JWT)\n\n### Cấu trúc JWT\n```\nheader.payload.signature\n```\n\n### Sign Token\n```javascript\nimport jwt from \"jsonwebtoken\";\n\nconst token = jwt.sign(\n  { userId: user.id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: \"7d\" }\n);\n```\n\n### Middleware xác thực\n```javascript\nconst requireAuth = (req, res, next) => {\n  const token = req.headers.authorization?.split(\" \")[1];\n  if (!token) return res.status(401).json({ error: \"Unauthorized\" });\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(401).json({ error: \"Invalid token\" });\n  }\n};\n\nrouter.get(\"/profile\", requireAuth, (req, res) => {\n  res.json({ user: req.user });\n});\n```",
    "examples": [],
    "vocabulary": ["JWT", "Bearer token", "payload", "signature", "Authorization header"]
  }',
  'advanced', 35, 'nodejs', 1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. CODE CHALLENGES — Arrow Functions lesson
-- ============================================================
INSERT INTO public.code_challenges (id, lesson_id, title, description, starter_code, solution_code, test_cases, hints, difficulty, concepts, order_index)
VALUES
(
  'd1010200-0000-0000-0000-000000000001',
  'c1010200-0000-0000-0000-000000000002',
  'Chuyển sang Arrow Function',
  'Viết lại các function sau dưới dạng arrow function. Hàm double nhân đôi một số, hàm isEven kiểm tra số chẵn, hàm greet trả về chuỗi chào.',
  '// Chuyển các function này sang arrow function

// 1. Nhân đôi số
function double(n) {
  return n * 2;
}

// 2. Kiểm tra số chẵn
function isEven(n) {
  return n % 2 === 0;
}

// 3. Chào người dùng
function greet(name) {
  return `Hello, ${name}!`;
}

// Test
console.log(double(5));      // 10
console.log(isEven(4));      // true
console.log(greet("An"));    // Hello, An!',
  'const double = n => n * 2;
const isEven = n => n % 2 === 0;
const greet = name => `Hello, ${name}!`;

console.log(double(5));
console.log(isEven(4));
console.log(greet("An"));',
  '[{"input": "double(5)", "expected": "10", "description": "double(5) phải trả về 10"}, {"input": "isEven(4)", "expected": "true", "description": "isEven(4) phải trả về true"}]',
  '["Dùng const thay function", "Arrow function 1 tham số không cần dấu ()", "Nếu chỉ có 1 câu lệnh return, bỏ {} và return"]',
  'beginner',
  '["arrow function", "implicit return", "const"]',
  1
),
(
  'd1010200-0000-0000-0000-000000000002',
  'c1010200-0000-0000-0000-000000000002',
  'Arrow Function với Array Methods',
  'Dùng arrow function kết hợp với map, filter, reduce để xử lý mảng số. Lọc số chẵn, nhân đôi, rồi tính tổng.',
  'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Bước 1: Lọc các số chẵn
const evens = numbers.filter(/* arrow function ở đây */);

// Bước 2: Nhân đôi mỗi số chẵn
const doubled = evens.map(/* arrow function ở đây */);

// Bước 3: Tính tổng
const sum = doubled.reduce(/* arrow function ở đây */, 0);

console.log("Số chẵn:", evens);    // [2, 4, 6, 8, 10]
console.log("Nhân đôi:", doubled); // [4, 8, 12, 16, 20]
console.log("Tổng:", sum);          // 60',
  'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = numbers.filter(n => n % 2 === 0);
const doubled = evens.map(n => n * 2);
const sum = doubled.reduce((acc, n) => acc + n, 0);
console.log("Số chẵn:", evens);
console.log("Nhân đôi:", doubled);
console.log("Tổng:", sum);',
  '[{"input": "sum", "expected": "60", "description": "Tổng cuối phải là 60"}]',
  '["filter nhận callback trả về boolean", "map transform mỗi phần tử", "reduce nhận (accumulator, currentValue) => newAccumulator"]',
  'beginner',
  '["arrow function", "filter", "map", "reduce"]',
  2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CODE CHALLENGES — Destructuring lesson
-- ============================================================
INSERT INTO public.code_challenges (id, lesson_id, title, description, starter_code, solution_code, test_cases, hints, difficulty, concepts, order_index)
VALUES
(
  'd1020100-0000-0000-0000-000000000003',
  'c1020100-0000-0000-0000-000000000004',
  'Destructuring Profile Card',
  'Dùng destructuring để trích xuất thông tin từ object user. Dùng nested destructuring và default values.',
  'const user = {
  firstName: "Nguyễn",
  lastName: "An",
  age: 25,
  address: {
    city: "Hà Nội",
    district: "Ba Đình"
  },
  hobbies: ["coding", "reading", "gaming"]
};

// Dùng destructuring để lấy:
// - firstName, lastName
// - age (với default 18 nếu không có)
// - city từ address (nested destructuring)
// - hobby đầu tiên từ mảng hobbies

// Kết quả mong đợi:
// Họ tên: Nguyễn An
// Tuổi: 25
// Thành phố: Hà Nội
// Sở thích đầu tiên: coding',
  'const {
  firstName,
  lastName,
  age = 18,
  address: { city },
  hobbies: [firstHobby]
} = user;

console.log(`Họ tên: ${firstName} ${lastName}`);
console.log(`Tuổi: ${age}`);
console.log(`Thành phố: ${city}`);
console.log(`Sở thích đầu tiên: ${firstHobby}`);',
  '[{"input": "city", "expected": "Hà Nội", "description": "Nested destructuring từ address.city"}]',
  '["Nested destructuring: { address: { city } }", "Array destructuring: [firstHobby] lấy phần tử đầu", "Default value: age = 18"]',
  'beginner',
  '["object destructuring", "array destructuring", "nested", "default value"]',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CODE CHALLENGES — Async/Await lesson
-- ============================================================
INSERT INTO public.code_challenges (id, lesson_id, title, description, starter_code, solution_code, test_cases, hints, difficulty, concepts, order_index)
VALUES
(
  'd1030200-0000-0000-0000-000000000004',
  'c1030200-0000-0000-0000-000000000007',
  'Fetch Dữ Liệu với Async/Await',
  'Viết hàm getUserData dùng async/await để fetch dữ liệu. Xử lý lỗi với try/catch và retry 1 lần nếu thất bại.',
  '// Giả lập API call
const fakeAPI = (id) => new Promise((resolve, reject) => {
  const shouldFail = Math.random() < 0.3;
  setTimeout(() => {
    if (shouldFail) reject(new Error("Network error"));
    else resolve({ id, name: "User " + id, score: Math.floor(Math.random() * 100) });
  }, 300);
});

// Viết hàm getUserData với:
// 1. async/await
// 2. try/catch để xử lý lỗi
// 3. Retry 1 lần nếu lần đầu thất bại
async function getUserData(id) {
  // Code của bạn ở đây
}

// Test
getUserData(42).then(user => console.log("User:", user.name));',
  'const fakeAPI = (id) => new Promise((resolve, reject) => {
  const shouldFail = Math.random() < 0.3;
  setTimeout(() => {
    if (shouldFail) reject(new Error("Network error"));
    else resolve({ id, name: "User " + id, score: Math.floor(Math.random() * 100) });
  }, 300);
});

async function getUserData(id) {
  try {
    return await fakeAPI(id);
  } catch (error) {
    console.log("Lần 1 thất bại, thử lại...");
    try {
      return await fakeAPI(id);
    } catch (retryError) {
      throw new Error(`Không thể lấy dữ liệu: ${retryError.message}`);
    }
  }
}

getUserData(42).then(user => console.log("User:", user.name));',
  '[{"input": "typeof getUserData", "expected": "function", "description": "getUserData phải là async function"}]',
  '["Đặt từ khóa async trước function", "Dùng await để chờ Promise", "try { await ... } catch { retry }", "Nested try/catch cho retry"]',
  'intermediate',
  '["async", "await", "try/catch", "retry", "Promise"]',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CODE CHALLENGES — Express Middleware lesson
-- ============================================================
INSERT INTO public.code_challenges (id, lesson_id, title, description, starter_code, solution_code, test_cases, hints, difficulty, concepts, order_index)
VALUES
(
  'd2020100-0000-0000-0000-000000000005',
  'c2020100-0000-0000-0000-000000000012',
  'Tạo Middleware Logger',
  'Viết middleware logger ghi lại mỗi request với format: [METHOD] /path - STATUS - Xms. Middleware phải tính thời gian xử lý.',
  '// Viết logger middleware
// Format: [GET] /api/users - 200 - 15ms

const logger = (req, res, next) => {
  // Code của bạn ở đây
  // Gợi ý: Dùng Date.now() để tính thời gian
  // Gợi ý: Lắng nghe sự kiện res.on("finish", ...)
};

// Sử dụng:
// app.use(logger);',
  'const logger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};',
  '[{"input": "typeof logger", "expected": "function", "description": "logger phải là function với 3 tham số"}]',
  '["Middleware có 3 tham số: (req, res, next)", "Dùng Date.now() để đo thời gian", "res.on(\"finish\") fires khi response gửi xong", "Nhớ gọi next() để không block request"]',
  'intermediate',
  '["middleware", "express", "timing", "event listener"]',
  1
)
ON CONFLICT (id) DO NOTHING;
