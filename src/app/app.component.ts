import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodicElement } from './interfaces/periodicElements';
import { DataServiceService } from './services/data-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  title = 'Tecnical Test';
  showFiller = false;
  form!: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'create', 'actions'];
  elements: PeriodicElement[] = [];
  search: string = '';
  objectEdit: PeriodicElement = {position: 0, name: '', weight: 0, symbol: ''};

  constructor(private dataService: DataServiceService, private fb:FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.getListElements();
    //string to JSON
    console.log(JSON.parse(localStorage.getItem('data') || '{}'));
    
  }

  getListElements() {

    let data = JSON.parse(localStorage.getItem('data') || '{}');
    if(data.length > 0) {
      this.elements = data;
    }else{
      this.elements = [...this.dataService.ELEMENT_DATA];
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      weight: ['', Validators.required],
      symbol: ['', Validators.required]
    });
  }

  btnAdd() {
    this.getListElements();
    let maxPosition: number = 0;
    if(this.elements.length > 0) {
      //search max position
      maxPosition = Math.max.apply(Math, this.elements.map(function(o) { return o.position; }));  
    }
    
    this.elements.push({
      position: maxPosition + 1,
      name: this.form.value.name,
      weight: this.form.value.weight,
      symbol: this.form.value.symbol,
      dateCreate: new Date()
    });
    
    this.dataService.ELEMENT_DATA = this.elements;
    console.log(this.form.value);
    console.log(this.elements);
    this.saveData();
    this.getListElements();
    this.form.reset();
  }


  editElement(element: PeriodicElement) {
    this.form.setValue({
      name: element.name,
      weight: element.weight,
      symbol: element.symbol
    });
    this.objectEdit = element;
  }

  updateElement(element: PeriodicElement) {
     
     this.elements[this.elements.indexOf(element)] = {
      position: element.position,
      name: this.form.value.name,
      weight: this.form.value.weight,
      symbol: this.form.value.symbol
    };

    let data = JSON.parse(localStorage.getItem('data') || '{}');
    if(data.length > 0) {
      this.dataService.ELEMENT_DATA = data;
    }

  
  this.dataService.ELEMENT_DATA.forEach((item) => {
      if(item.position === element.position) {
        item.name = this.form.value.name;
        item.weight = this.form.value.weight;
        item.symbol = this.form.value.symbol;
      }
    });
    
    this.saveData();
    this.getListElements();
    this.objectEdit = {position: 0, name: '', weight: 0, symbol: ''}
    this.form.reset();
  }

  btnSearch() {
      this.getListElements();
     if(this.search !== '') {
      this.elements = this.elements.filter((item) => item.name.toLowerCase().includes(this.search.toLowerCase()));
      console.log(this.search);
     } else {
      this.getListElements();
     }
  }

  
  btnDelete(element: PeriodicElement) {
    console.log(element);
    this.getListElements();
    
    this.elements = this.elements.filter((item) => item.position !== element.position);
    this.dataService.ELEMENT_DATA = this.elements;
    this.saveData();
    this.getListElements();
  }

  saveData() {
    this.dataService.saveData(this.dataService.ELEMENT_DATA);
    console.log(localStorage.getItem('data'));
  }

  generateList() {
    this.dataService.generateList();
    this.saveData();
    this.getListElements();
    
  }

}
