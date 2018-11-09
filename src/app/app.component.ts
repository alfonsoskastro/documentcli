import { Component } from '@angular/core';
import { MarkdownParserService } from './markdown-parser.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MarkdownParserService]
})
export class AppComponent {
  title = 'documentcli';
  changedText: string;
  documents = null;

  constructor(private md: MarkdownParserService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.http.get('http://localhost:10010/document?iduser=1').subscribe(data => {
      let temDocument = [];

      Object.values(data).forEach(rootDocument => {
        rootDocument.document.forEach(element => {
          temDocument.push(element);
        });
      });

      this.documents = temDocument;
    });
  }

  changeText(mdText: string) {
    this.changedText = this.md.changeText(mdText)
  }
}
