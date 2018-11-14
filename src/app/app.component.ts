import { Component } from '@angular/core';
import { MarkdownParserService } from './markdown-parser.service';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MarkdownParserService]
})
export class AppComponent {
  title = 'documentcli';
  changedText: string;
  rootDocument = null;
  documents = null;
  myTextArea = "";
  actualDocument = null;


  constructor(private md: MarkdownParserService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.http.get('http://localhost:10010/document?iduser=1').subscribe(data => {
      let temDocument = [];

      Object.values(data).forEach(rootDocumentTem => {
        delete rootDocumentTem["createdAt"];
        delete rootDocumentTem["updatedAt"];
        this.rootDocument = rootDocumentTem;
        rootDocumentTem.document.forEach(element => {
          temDocument.push(element);
        });
      });

      if (temDocument.length > 0) {
        var docSelect = temDocument[0];
        this.actualDocument = docSelect;
        this.myTextArea = docSelect.text;
        this.changeText(docSelect.text);
      }

      this.documents = temDocument;
    });
  }

  changeText(mdText: string) {
    this.changedText = this.md.changeText(mdText);
    this.actualDocument.text = mdText;

  }

  onClickDocument(document: any) {
    this.actualDocument = document;
    this.myTextArea = document.text;
    this.changeText(document.text);
  }

  onClickDelete(document: any) {
    this.rootDocument.document = this.rootDocument.document.filter(doc => doc.key != document.key);
  
    this.myTextArea = "";
    this.changeText("");
    this.updateDocument(this.rootDocument);
  }

  onClickSave(document: any) {
    var temDocument = this.rootDocument.document.filter(doc => doc.key != this.actualDocument.key);
    temDocument.push(this.actualDocument);
    this.rootDocument.document = temDocument;

    this.updateDocument(this.rootDocument);
  }


  newDocument() {
    let newDocument = {
      key: UUID.UUID(),
      name: "doc" + (this.rootDocument.document.length + 1),
      text: "",
    }
    this.rootDocument.document.push(newDocument);
    this.updateDocument(this.rootDocument);
  }



  updateDocument(rootDocument: any) {
    this.http.post('http://localhost:10010/document', rootDocument)
      .subscribe(data => {
        this.documents = data.document;

      })

  }
}
