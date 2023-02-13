import { Component, OnInit } from '@angular/core';
import { documentHelper } from '@custom-library/basics/test';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'test-app';


  ngOnInit(): void {
    this.compare();
  }

  compare() {
    console.log(documentHelper.getElementById("title"));
  }
}
