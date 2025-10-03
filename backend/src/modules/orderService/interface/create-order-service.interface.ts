export interface CreateOrderPayload {
	userId: number;
	description: string;
	checklist: { label: string; checked: boolean }[];
	photos: { url: string }[];
}
