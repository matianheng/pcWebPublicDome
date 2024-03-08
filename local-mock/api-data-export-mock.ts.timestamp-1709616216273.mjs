// local-mock/api-data-export-mock.ts
import { join } from "path";
import { defineMock } from "vite-plugin-mock-dev-server";
import { createReadStream, statSync } from "fs";
import path from "path";
var api_data_export_mock_default = defineMock([
  {
    url: "/local-mock-api/data-export/suc",
    method: "POST",
    status: 200,
    delay: 1500,
    response: (req, res, next) => {
      const fileName = encodeURIComponent("\u8868\u683C.xlsx");
      const filePath = path.resolve(join("local-mock", "test.xlsx"));
      const readStream = createReadStream(filePath);
      const stats = statSync(filePath);
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-disposition": "attachment; filename=" + fileName,
        "Content-Length": stats.size
      });
      readStream.pipe(res);
    }
  },
  {
    url: "/local-mock-api/data-export/exp",
    method: "POST",
    status: 200,
    delay: 500,
    body: {
      status: 1,
      msg: "\u6211\u662F\u540E\u7AEF\u6587\u4EF6\u4E0B\u8F7D\u63A5\u53E3\u629B\u51FA\u7684\u5F02\u5E38"
    }
  },
  {
    url: "/local-mock-api/pdf",
    method: "POST",
    status: 200,
    delay: 1500,
    response: (req, res, next) => {
      const fileName = encodeURIComponent("\u6D4B\u8BD5pdf.xlsx");
      const filePath = path.resolve(join("local-mock", "test.pdf"));
      const readStream = createReadStream(filePath);
      const stats = statSync(filePath);
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-disposition": "attachment; filename=" + fileName,
        "Content-Length": stats.size
      });
      readStream.pipe(res);
    }
  }
]);
export {
  api_data_export_mock_default as default
};
