import { Module } from '@nestjs/common';
import { ElasticModule } from '@src/modules/core/elastic/elastic.module';
import { SearchController } from '@src/modules/search/controllers/search.controller';
import { SearchService } from '@src/modules/search/serviecs/search.service';

/**
 * 나중에 search 관련 기능 생길 때 사용
 */
@Module({
  imports: [ElasticModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
