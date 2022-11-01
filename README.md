# dcCmtCrawler
디시인사이드 댓글 집계용 크롤러

### 사용법
```
node main.js
```

### main.js 구성
``` js
    // 해당 소스는 댓글 집계용
    // 첫번째 인자는 갤러리 id, 두번째 인자는 mager / miner 구분
    let crawler = new CrawlerModule('sdvx', CONST.GALL_GUBUN.MAGER);
    crawler.setDebug(true);
    crawler.run();
    
    //해당 소스는 통계추출용
    let stts = new StatisticsModule('sdvx');
    stts.YYYYMM = '202210';
    stts.run();
```
- 두개 중 1개의 구문만 실행되도록 할것
- 추후에는 인자받아서 실행될 수 있도록 변경 예정

### 기타 설명
- 데이터 저장은 sqlite를 사용
- src/db/data_insert.sql 실행 후 사용할 것
- `CURR_ID` 테이블의 경우 각 갤러리의 현재 게시글ID를 저장하고 있음
- 데이터 수정 시 SQLITE DB 접근 툴 사용 권장
- [툴다운로드](https://sqlitebrowser.org/dl/)