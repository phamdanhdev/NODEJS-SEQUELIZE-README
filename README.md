# Integrate NodeJS + Sequelize + MySQL

Chúng ta sẽ xây dựng một Project đơn giản và tìm hiểu cách tích hợp NodeJS và Sequelize với nhau và kiểm tra dữ liệu trả về bằng API

### Chuẩn bị và cài đặt trước?

- VS Code
- Yarn
- NodeJS
- MySQL + MySQL Workbench
- Internet

### Sequelize là gì?

Sequelize là một ORM Node.js dựa trên Promise. Nó có thể được sử dụng với PostgreSQL, MySQL, MariaDB, SQLite và MSSQL.

- Giúp cho việc tạo Table dưới DB nhanh chóng
- Tạo liên kết giữa các Table dễ dàng (Nói vậy chứ cũng khoai đấy 😄 )
- Không cần dùng Query để truy vấn, chỉ cần sử dụng các hàm được build sẵn của Models

### Migrations, Seeders, Faker, Association, Query Models là gì và cách sử dụng nó?

Project này sẽ sử dụng các công cụ trên để phục vụ cho việc tích hợp NodeJS và Sequelize nhanh và dễ dàng hơn

- **Migrations** là công cụ để Sequelize tạo bảng dưới DB mà không cần Excute câu Query để tạo bảng trong MySQL Workbench.
- **Seeders** là công cụ để chứa các dữ liệu tĩnh (Dummy data), sử dụng cho việc đẩy dữ liệu vào DB để test các API.
- **Faker** là công cụ để tạo ra dữ liệu tĩnh (Dummy data)
- **Association** là liên kết các bảng DB lại với nhau, với Sequelize là liên kết các Models với nhau
- **Query Models** là sử dụng các hàm được build sẵn để lấy dữ liệu từ DB

## Bắt đầu thôi!

Trước tiên ta cần phải có 1 Project NodeJS và 1 Schema trong DB

**I. Tạo Project NodeJS**

- Trong Terminal

```bash
  yarn init -y
```

- Thêm các thư viện

```bash
  yarn add express sequelize mysql2 nodemon faker
```

thêm công cụ này nữa:

```bash
  yarn add sequelize-cli --dev
```

- Cấu hình **package.json** một chút, thêm dòng này để nodemon tự restart server khi có thay đổi:

```bash
    "scripts": {
    "start": "nodemon server.js"
    },
```

**package.json** sẽ như này:

```bash
    {
  "name": "NODEJS-SEQUELIZE-README",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:phamdanhdev/NODEJS-SEQUELIZE-README.git",
  "author": "phamdanhdev <phamdanh.dev@gmail.com>",
  "license": "MIT",
  "scripts": {
    "start": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "faker": "^5.5.3",
    "mysql2": "^2.2.5",
    "nodemon": "^2.0.12",
    "sequelize": "^6.6.5"
  },
  "devDependencies": {
    "sequelize-cli": "^6.2.0"
  }
}

```

- Tạo 1 file **server.js** đơn giản trên PORT 3001 (Có thể thay đổi PORT khác)

```bash
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen("3001", () => {
    console.log(`SERVER STARTED ON PORT 3001`);
  });
```

**II. Tạo Schema trong DB**

- Mở **MySQL Workbench**, tạo 1 Schema tên **migratetest** là xong
  Chúng ta không cần tạo Table hay chạy 1 câu Query nào.

## ERD của Database

Chúng ta có 1 DB đơn giản với các Table như sau:

#### User

Người dùng, cụ thể là 1 Student

- Table **User** có quan hệ **Many - Many** với Table **Class**
- Table **User** có quan hệ **One - One** với Table **Doc** (Documnent)

| KEY | Column Name | Type    |
| :-- | :---------- | :------ |
| PK  | id          | integer |
|     | name        | varchar |

#### Class

Một lớp học

- Table **Class** có quan hệ **Many - Many** với Table **User**

| KEY | Column Name | Type    |
| :-- | :---------- | :------ |
| PK  | id          | integer |
|     | name        | varchar |

#### Doc (Documnent)

Mỗi học sinh sẽ có 1 tài liệu để chứng minh là Student

- Table **Doc** (Documnent) có quan hệ **One - One** với Table **User**

| KEY | Column Name | Type    |
| :-- | :---------- | :------ |
| PK  | id          | integer |
|     | name        | varchar |
| FK  | userId      | integer |

#### UserClass

Một Bridge Table được tạo từ quan hệ **Many - Many** của Table **User** và Table **Class**

- Table **Doc** (Documnent) có quan hệ **One - One** với Table **User**

| KEY | Column Name | Type    |
| :-- | :---------- | :------ |
| PK  | id          | integer |
| FK  | userId      | integer |
| FK  | classId     | integer |

## Tích hợp Sequelize với NodeJS

Tài liệu tham khảo **Sequelize Commands**: https://www.npmjs.com/package/sequelize-cli

Trong Terminal, khởi tạo Sequelize bằng lệnh:

```bash
    sequelize init
```

Sau khi chạy lệnh trên, các folder sẽ được **tự động tạo**:

- **config** có sẵn file **config.json** chứa thông tin DB
- **migrations** để chứa các file tạo Table dưới DB
- **models** để chứa các Models.
- **seeders** để chứa file tạo dữ liệu tĩnh (Dummy data)

Mở file **config.json** trong folder **config** cấu hình thông tin DB

```bash
  "development": {
    "username": "root",
    "password": "fill_your_DB_password_here",
    "database": "migratetest",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```

Sau đó trong Terminal, tạo kết nối Sequelize tới DB dựa trên thông tin trong file **config.json**:

```bash
    sequelize db:create
```

### Tạo Model cho từng Table theo ERD

#### LƯU Ý

```
Ưu tiên tạo các bảng không có liên kết trước
Không cần gõ cột id, vì id sẽ được tự động tạo
Tên của Model sẽ được tự động chuyển từ UPPERCASE -> LOWERCASE và thêm số nhiều vào dưới DB (Ex: User -> users)
Lưu ý: Giữa các attributes không có khoảng cách (space)
Sau khi gõ lệnh tạo, Sequelize sẽ tự động tạo 2 file tương ứng với nó trong folder Migrations và folder Models
Về lý thuyết, file ở folder Migrations để tạo dữ liệu các Table và liên kết của nó dưới DB, còn file ở folder Models phục vụ cho việc gọi Model để thực hiện Query
Về liên kết, chúng ta phải cấu hình liên kết cho Migrations riêng và Models riêng
```

Cú pháp:

```bash
sequelize model:generate --name NameOfModel --attributes NameOfProperty:TypeOfProperty
```

- Tạo Model **User**

```bash
sequelize model:generate --name User --attributes name:string
```

- Tạo Model **Class**

```bash
sequelize model:generate --name Class --attributes name:string
```

- Tạo Model **Doc**

```bash
sequelize model:generate --name Doc --attributes name:string,userId:integer
```

- Tạo Model **UserClass**

```bash
sequelize model:generate --name UserClass --attributes userId:integer,classId:integer
```

### Khởi tạo liên kết giữa các Model

#### LƯU Ý

```
KHỞI TẠO LIÊN KẾT CHO CẢ 2 FILE CỦA MODEL Ở FOLDER MIGRATIONS VÀ FOLDER MODELS
NẾU ĐÃ TẠO foreignKey ở hasOne, hasMany, thì belongsTo không cần tạo foreignKey
NẾU belongsToMany, thì cả 2 Table đều phải tạo foreignKey
```

#### Trong Sequelize

```
Có 3 cặp liên kết:
1) hasOne - belongsTo : Sử dụng cho liên kết One - One
2) hasMany - belongsTo : Sử dụng cho liên kết One - Many
3) belongsToMany - belongsToMany : Sử dụng cho liên kết Many - Many
```

#### Các Model sau khi được gắn liên kết:

- Model **User**

#### user.js

```
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Doc, {
        foreignKey: "userId",
      });
      User.hasMany(models.UserClass, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
```

#### xxxxxxxxxxxxxx-create-user.js

```
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
```

- Model **Class**

#### class.js

```
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Class.hasMany(models.UserClass, {
        foreignKey: "classId",
      });
    }
  }
  Class.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};

```

#### xxxxxxxxxxxxxx-create-class.js

```
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Classes');
  }
};
```

- Model **Doc**

#### doc.js

```
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doc.belongsTo(models.User);
    }
  }
  Doc.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doc",
    }
  );
  return Doc;
};

```

#### xxxxxxxxxxxxxx-create-doc.js

```
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Docs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Docs");
  },
};

```

- Model **UserClass**

#### userclass.js

```
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserClass.belongsTo(models.User);
      UserClass.belongsTo(models.Class);
    }
  }
  UserClass.init(
    {
      userId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserClass",
    }
  );
  return UserClass;
};

```

#### xxxxxxxxxxxxxx-create-user-class.js

```
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserClasses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        referrences: {
          model: "userclasses",
          key: "userId",
        },
      },
      classId: {
        type: Sequelize.INTEGER,
        referrences: {
          model: "userclasses",
          key: "classId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserClasses");
  },
};

```

## Tạo bảng cho Database

Trong Terminal, chạy lệnh này để tạo các Table trong DB

```
sequelize db:migrate
```

Có thể kiểm tra lại trong `MySQL Workbench`

## Sử dụng Seeders và Faker tạo dữ liệu cho DB

#### LƯU Ý

```
Mỗi Model sẽ cần tạo 1 file Seeders riêng
Faker được sử dụng để tạo ra dữ liệu ngẫu nhiên
```

Tham khảo tài liệu Faker: https://yarnpkg.com/package/faker

Cú pháp tạo Seeders

```
sequelize seed:create --name nameOfBlaBla
```

#### Tạo ra các file cho Model với cú pháp:

```
sequelize seed:create --name UserData
```

```
sequelize seed:create --name ClassData
```

```
sequelize seed:create --name DocData
```

```
sequelize seed:create --name UserClassData
```

Dữ liệu các file trong folder Seeders như sau:

#### xxxxxxxxxxxxxx-UserData.js

```
"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let amount = 5;
    while (amount--) {
      let date = new Date();
      data.push({
        name: faker.name.findName(),
        createdAt: date,
        updatedAt: date,
      });
    }

    await queryInterface.bulkInsert("users", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};

```

#### xxxxxxxxxxxxxx-ClassData.js

```
"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let date = new Date();
    let count = 5;
    while (count--) {
      data.push({
        name: faker.name.firstName(),
        createdAt: date,
        updatedAt: date,
      });
    }
    await queryInterface.bulkInsert("classes", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("classes", null, {});
  },
};

```

#### xxxxxxxxxxxxxx-DocData.js

```
"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let count = 5;
    let userId = 1;
    while (count--) {
      let date = new Date();
      data.push({
        name: faker.name.lastName(),
        userId: userId++,
        createdAt: date,
        updatedAt: date,
      });
    }

    await queryInterface.bulkInsert("docs", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("docs", null, {});
  },
};

```

#### xxxxxxxxxxxxxx-UserClassData.js

```
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let date = new Date();

    data.push(
      {
        userId: 1,
        classId: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 1,
        classId: 3,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 4,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 5,
        createdAt: date,
        updatedAt: date,
      }
    );

    await queryInterface.bulkInsert("userclasses", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("userclasses", null, {});
  },
};

```

#### Sau cùng, đẩy toàn bộ dữ liệu vào DB

Cú pháp

```
sequelize db:seed:all
```

## Truy vấn dữ liệu với Sequelize

Chúng ta truy vấn dữ liệu thông qua Model

### Tạo Routes cho Server

- Tạo folder **routes**
- Tạo file **apiRoutes.js** trong folder **routes**

#### apiRoutes

```
const express = require("express");
const routes = express.Router();
const db = require("../models");

routes.get("/", (req, res) => {
  db.User.findAll().then((user) => res.json(user));
});

routes.get("/findAllUserInClass/:name", (req, res) => {
  db.User.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.UserClass,
        where: {},
        include: [
          { attributes: [], model: db.Class, where: { name: req.params.name } },
        ],
      },
    ],
  }).then((data) => res.json(data));
});

routes.get("/findDocOfUser/:id", (req, res) => {
  db.Doc.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.User,
        where: { id: req.params.id },
      },
    ],
  }).then((data) => res.json(data));
});

routes.get("/findUserOfDoc/:id", (req, res) => {
  db.User.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.Doc,
        where: { id: req.params.id },
      },
    ],
  }).then((data) => res.json(data));
});

module.exports = routes;

```

Bây giờ có thể dùng Postman để kiểm tra dữ liệu trả về từ API.

## Bàn luận về Query Model

Tài liệu tham khảo: https://sequelize.org/master/manual/model-querying-basics.html

#### apiRoutes.js

```
routes.get("/findAllUserInClass/:name", (req, res) => {
  db.User.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.UserClass,
        where: {},
        include: [
          { attributes: [], model: db.Class, where: { name: req.params.name } },
        ],
      },
    ],
  }).then((data) => res.json(data));
});
```

- **attributes** sẽ quyết định dữ liệu nào của Model được trả về. Nếu để mảng rỗng, dữ liệu sẽ không trả về. Nếu không có thuộc tính attributes, dữ liệu trả về tất cả các dữ liệu
- **include** để JOIN 2 Table lại với nhau
- **model** là tên Table được JOIN
- **where** là điều kiện trên chính Table đó. Trong JOIN Table, where là {} (Một Object rỗng) hoặc có tham số thì sẽ INNER JOIN (Recommend sử dụng cái này như Example trên), còn nếu không thì LEFT OUTER JOIN.
