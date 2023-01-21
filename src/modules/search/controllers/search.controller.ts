import { Controller } from '@nestjs/common';
import { SearchService } from '@src/modules/search/serviecs/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
}
