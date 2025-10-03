import { ChangeDetectorRef, Component, OnInit, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdersService } from '../../services/orders';
import { AuthService } from '../../services/auth';

interface ImagePreview {
  file?: File;
  url: string;
  isExisting?: boolean;
}

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-order.html',
  styleUrls: ['./edit-order.scss'],
})
export class EditOrder implements OnInit {
  orderForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  selectedImages: ImagePreview[] = [];
  maxImages = 10;
  orderId: number = 0;

  checklistItems = [
    { id: 'item1', label: 'Verificação de equipamentos' },
    { id: 'item2', label: 'Análise de documentação' },
    { id: 'item3', label: 'Teste de funcionamento' },
    { id: 'item4', label: 'Limpeza e manutenção' },
    { id: 'item5', label: 'Relatório final' },
  ];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      item1: [false],
      item2: [false],
      item3: [false],
      item4: [false],
      item5: [false],
    });

    afterNextRender(() => {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrderData();
  }

  loadOrderData() {
    this.isLoadingData = true;

    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.isLoadingData = false;
        console.log('Ordem carregada:', order);

        this.orderForm.patchValue({
          description: order.description,
        });

        if (order.checklist && order.checklist.length > 0) {
          order.checklist.forEach((item: any, index: number) => {
            if (index < 5) {
              this.orderForm.patchValue({
                [`item${index + 1}`]: item.checked,
              });
              this.checklistItems[index].label = item.label;
            }
          });
        }

        if (order.photos && order.photos.length > 0) {
          this.selectedImages = order.photos.map((photo: any) => ({
            url: `http://localhost:3000${photo.url}`,
            isExisting: true,
          }));
        }
      },
      error: (error) => {
        this.isLoadingData = false;
        console.error('Erro ao carregar ordem:', error);

        this.snackBar.open('Erro ao carregar dados da ordem', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });

        this.router.navigate(['/orders']);
      },
    });
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length + this.selectedImages.length > this.maxImages) {
      this.snackBar.open(`Você pode selecionar no máximo ${this.maxImages} imagens`, 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Apenas arquivos de imagem são permitidos', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Imagem muito grande. Máximo 5MB', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        continue;
      }

      try {
        const dataUrl = await this.readFileAsDataURL(file);
        this.selectedImages.push({ file, url: dataUrl });
      } catch (err) {
        console.error('Erro lendo arquivo', err);
      }
    }

    this.cdr.detectChanges();

    event.target.value = '';
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('description', this.orderForm.value.description);

    const checklist = [
      { label: this.checklistItems[0].label, checked: this.orderForm.value.item1 },
      { label: this.checklistItems[1].label, checked: this.orderForm.value.item2 },
      { label: this.checklistItems[2].label, checked: this.orderForm.value.item3 },
      { label: this.checklistItems[3].label, checked: this.orderForm.value.item4 },
      { label: this.checklistItems[4].label, checked: this.orderForm.value.item5 },
    ];

    formData.append('checklist', JSON.stringify(checklist));

    const newPhotos = this.selectedImages.filter((img) => !img.isExisting && img.file);
    newPhotos.forEach((image) => {
      if (image.file) {
        formData.append('photos', image.file, image.file.name);
      }
    });

    const existingPhotos = this.selectedImages
      .filter((img) => img.isExisting)
      .map((img) => ({ url: img.url.replace('http://localhost:3000', '') }));


    formData.append('existingPhotos', JSON.stringify(existingPhotos));

    this.ordersService.updateOrder(this.orderId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Ordem atualizada com sucesso:', response);

        this.snackBar.open('Ordem de serviço atualizada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao atualizar ordem:', error);

        const errorMessage = error.error?.message || 'Erro ao atualizar ordem de serviço';

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  getDescriptionErrorMessage() {
    const control = this.orderForm.get('description');
    if (control?.hasError('required')) {
      return 'Descrição é obrigatória';
    }
    return control?.hasError('minlength') ? 'Descrição deve ter no mínimo 10 caracteres' : '';
  }
}
