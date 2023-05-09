import { Component } from '@angular/core';
import {  FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent {
  productoForm:FormGroup;
  titulo="CREAR PRODUCTO";
  id:string|null;

  constructor(private fb:FormBuilder ,
    private router:Router,private toastr: ToastrService,
    private _productoService:ProductoService,private aRouter:ActivatedRoute){

    this.productoForm=this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    })
    this.id=this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit():void{
    this.esEditar();
  }

  agregarProducto(){
   
    const PRODUCTO:Producto ={
      nombre:this.productoForm.get('producto')?.value,
      categoria:this.productoForm.get('categoria')?.value,
      ubicacion:this.productoForm.get('ubicacion')?.value,
      precio:this.productoForm.get('precio')?.value,
      
    }

    if(this.id!= null){
      //editar
      this._productoService.editarProducto(this.id,PRODUCTO).subscribe(data=> {
        this.toastr.info('Modificado con exito', 'Producto modificado');
        this.router.navigate(['/']);
        },error=>{
          console.log(error);
          this.productoForm.reset();
        })
    }
    else{
      //agregar
      console.log(PRODUCTO);
    this._productoService.guardarProducto(PRODUCTO).subscribe(data=> {
      this.toastr.success('Registrado con exito', 'Producto registrado');
      this.router.navigate(['/']);
      },error=>{
        console.log(error);
        this.productoForm.reset();
      })
    }
    
   
  }

  esEditar(){
    if(this.id!= null){
      this.titulo="Editar producto";
      this._productoService.obtenerProducto(this.id).subscribe(data=> {
        this.productoForm.setValue({
          producto: data.nombre,
          categoria: data.categoria,
          ubicacion: data.ubicacion,
          precio: data.precio,
        });
        },error=>{
          console.log(error);

        })
    }
  }
}
