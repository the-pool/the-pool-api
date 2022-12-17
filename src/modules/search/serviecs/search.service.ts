import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async test() {
    // const temp = await this.elasticsearchService.search({
    //   index: 'skill',
    //   body: {
    //     query: {
    //       bool: {
    //         filter: {
    //           terms: {
    //             _id: ['2'],
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    const temp = await this.elasticsearchService.update({
      id: '3',
      index: 'skill',
      body: {
        doc: {
          name: 'asdnds',
        },
        doc_as_upsert: true,
      },
    });

    console.log(temp.body);

    return temp.body;
  }
}
