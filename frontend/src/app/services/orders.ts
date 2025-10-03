import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Order {
  id: number;
  title: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  description: string;
  checklist: {
    item1: boolean;
    item2: boolean;
    item3: boolean;
    item4: boolean;
    item5: boolean;
  };
  images?: File[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrders(userId: number): Observable<Order[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`, { headers });
  }

  createOrder(orderData: FormData, userId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/orders/${userId}`, orderData, { headers });
  }

  deleteOrder(orderId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.apiUrl}/orders/${orderId}`, { headers });
  }

  getOrderById(orderId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/orders/detail/${orderId}`, { headers });
  }

  updateOrder(orderId: number, orderData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/orders/${orderId}`, orderData, { headers });
  }
}
