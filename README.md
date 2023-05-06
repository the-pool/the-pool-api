# **The Pool Api**

### 주니어들의 성장을 도모하는 교육 플랫폼 The Pool 의 서버입니다.

- [Tech Stack](#tech-stack)

- [Directory Structure](#directory-structure)

- [Infra Architecture](#infra-architecture)

- [Commit Convention](#commit-convention)

- [Script](#script)

- [Related Projects](#related-projects)

- [Contributors](#contributors)

- [License](#license)

</br>

---

## **Tech Stack**

<p align="center">  
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=Typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=NestJS&logoColor=white"/>
  <img src="https://img.shields.io/badge/RestFul-EF2D5E?style=flat&logoColor=white"/>
  <img src="https://img.shields.io/badge/TDD-EF2D5E?style=flat&logoColor=white"/>
</p>
  
<br/>
<p align="center">  
  <img src="https://img.shields.io/badge/postgresql-4169E1?style=flat-the-badge&logo=PostgreSQL&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=Prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat&logo=Jest&logoColor=white"/>
</p>
 
<br/>
<p align="center">  
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=Amazon%20AWS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Terraform-7B42BC?style=flat&logo=Terraform&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white"/>
</p>

</br>

---

## **Directory Structure**

```bash
├── prisma
│   ├── functions # seed function directory
│   ├── migrations # migrations directory
│   ├── schema.prisma # prisma schema
│   └── seed.ts # db seed
├── scripts # script directory
├── src
│   ├── app.module.ts
│   ├── main.ts # main file
│   ├── common # common directory
│   ├── constants # common constant directory
│   ├── decorators # common decorator directory
│   ├── dtos # common dto directory
│   ├── filters # common filter directory
│   ├── guards # common guard directory
│   ├── helpers # common helper directory
│   ├── interceptors # common interceptor directory
│   ├── middlewares # common middleware directory
│   ├── pipes # common pipe directory
│   ├── types # common type directory
│   ├── modules # feature module directory
│   │   ├── index.ts # module index file
│   │   ├── core # don't have controller module directory
│   │   │   ├── auth # auth module directory
│   │   │   ├── core.module.ts # core module directory
│   │   │   ├── database # database module directory
│   │   │   ├── elastic # elastic stack module directory
│   │   │   ├── http # http module directory
│   │   │   ├── notification # notification module directory
│   │   │   ├── private-storage # private-storage module directory
│   │   │   ├── the-pool-cache # cache module directory
│   │   │   └── the-pool-config # config module directory
│   │   ├── feature
│   │   │   ├── controllers # controller directory
│   │   │   │   ├── member-statistics.controller.spec.ts # controller test file
│   │   │   │   ├── member-statistics.controller.ts # controller file
│   │   │   │   └── member-statistics.swagger.ts # swagger expression file
│   │   │   ├── services
│   │   │   │   ├── member-statistics.service.spec.ts # feature service test file
│   │   │   │   └── member-statistics.service.ts # feature service file
│   │   │   ├── dtos # feature dto directory
│   │   │   ├── entities # feature entity directory
│   │   │   ├── events # feature events directory
│   │   │   ├── listeners #feature listener directory
│   │   │   ├── types # feature type directory
│   │   │   └── feature.module.ts
└── test
    ├── jest-e2e.json # e2e config file
    ├── apis # api e2e test directory
    ├── mock # for testing mock
    └── utils # for testing util function
```

</br>

## **Infra Architecture**

---

[**`terraform`**](https://www.terraform.io/) 을 통해 구성합니다. <br/>
자세한 내용은 [**`the-pool-infra repository`**](https://github.com/the-pool/the-pool-infra) 를 확인해주세요

</br>

## **Commit Convention**

---

### [**`gitmoji`**](https://gitmoji.dev/) 를 사용하여 커밋합니다.

| 아이콘 | 코드                        | 설명                                       | 원문                         |
| ------ | --------------------------- | ------------------------------------------ | ---------------------------- |
| ✨     | :sparkles:                  | 새 기능                                    | Introduce new features.      |
| ♻      | :recycle:                   | 코드 리펙토링                              | Refactor code.               |
| 🔥     | :fire:                      | 코드 / 파일 삭제                           | Remove code or files.        |
| 🐛     | :bug:                       | 버그 수정 & 충돌해결                       | Fix a bug.                   |
| 🔀     | :twisted_rightwards_arrows: | 브랜치 합병                                | Merge branches.              |
| ✅     | :white_check_mark:          | 테스트 추가 / 수정                         | Add or update tests.         |
| 📝     | :memo:                      | 문서 추가 / 수정 (README, swagger, script) | Add or update documentation. |

<br/>

## **Script**

---

### **Server Start**

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

### **Test**

```bash
# unit test
$ npm run test

# watch mode
$ npm run test:watch

# e2e test
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### **Prisma**

```bash
# model generate
$ npx prisma generate

# .prisma file formatting
$ npx prisma format

# .prisma file validation check
$ npx prisma validate

# migration
$ npx prisma migrate dev --name postgres-init

# db push
$ npx prisma db push

# db seed
$ npx prisma db seed
```

### **Swagger**

```bash
# swagger initialize or formatting
# usage: npm run swagger -- -h
# ex) npm run swagger -- -m "member"
# ex) npm run swagger -- -m "lesson" -c "lesson-hashtag"
$ npm run swagger
```

<br/>

## **Related Projects**

---

- [the-pool-infra](https://github.com/the-pool/the-pool-infra)
- [the-pool-pull-request-reminder-action](https://github.com/the-pool/the-pool-pull-request-reminder-action)
- [the-pool-web](https://github.com/the-pool/the-pool-web)

</br>

## **Contributors**

---

- [**SeokHo Lee**](https:github.com/rrgks6221) - <rrgks@naver.com>
- [**RokWonk Kim**](https:github.com/Rokwonk) - <rokwon79@gmail.com>
- [**SuHyung Lee**](https:github.com/subroooo) - <clark9810@naver.com>

<br/>

## **License**

---

### ThePool is [MIT licensed](LICENSE).
