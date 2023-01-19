import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

/**
 * elastic stack 사용할 때 사용
 */
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
