import { Module } from '@nestjs/common';
import { ElasticModule } from '@src/modules/core/elastic/elastic.module';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './serviecs/search.service';

@Module({
  imports: [ElasticModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
