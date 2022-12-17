import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
      requestTimeout: 2 * 60 * 1000,
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticModule {}
