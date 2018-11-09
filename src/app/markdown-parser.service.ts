import { Injectable } from '@angular/core';

import * as marked from 'marked';

@Injectable()
export class MarkdownParserService {

  private md;


  constructor() {
    this.md = marked;

    this.md.setOptions({
      gfm: true,
      breaks: true
    })
  }

  changeText(markdonw: string) {
    
    return this.md.parse(markdonw);
  }

  
}

