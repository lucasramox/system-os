export interface UpdateOrderPayload {
	orderId: number;
	title?: string;
	description?: string;
	checklist?: { id?: number; label: string; checked: boolean }[];
	photos?: { id?: number; url: string }[];
}