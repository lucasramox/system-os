import { Component, OnInit, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrdersService, Order } from '../../services/orders';
import { AuthService } from '../../services/auth';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class Orders implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'createdAt', 'actions'];
  dataSource: Order[] = [];
  isLoading = false;
  userName: string = 'Usuário';

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    afterNextRender(() => {
      this.loadOrders();
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getUser();
    this.userName = user.name
  }

  loadOrders() {
    const user = this.authService.getUser();

    if (!user) {
      this.snackBar.open('Erro: Usuário não identificado', 'Fechar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    console.log('Carregando pedidos para o usuário:', user);

    this.ordersService.getOrders(user.id).subscribe({
      next: (orders) => {
        this.isLoading = false;
        this.dataSource = orders;
        this.cdr.detectChanges();
        console.log('Pedidos carregados:', orders);
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Erro ao carregar pedidos:', error);

        const errorMessage = error.error?.message || 'Erro ao carregar pedidos';

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  createOrder() {
    this.router.navigate(['/create-order']);
  }

  editOrder(order: Order) {
    this.router.navigate(['/edit-order', order.id]);
  }

  deleteOrder(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a ordem?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordersService.deleteOrder(order.id).subscribe({
          next: () => {
            this.snackBar.open('Ordem excluída com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });

            this.dataSource = this.dataSource.filter(o => o.id !== order.id);
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao excluir ordem:', error);

            const errorMessage = error.error?.message || 'Erro ao excluir ordem';

            this.snackBar.open(errorMessage, 'Fechar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
