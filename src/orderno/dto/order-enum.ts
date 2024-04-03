export enum OrderStatus {
  NotChecked = 'ยังไม่ถูกตรวจสอบ',
  InProgress = 'สินค้ากําลังดําเนินการ',
  Packing = 'กําลังแพ็คออก',
  OutOfStock = 'สินค้าออกจากคลัง',
  Delivered = 'จัดส่งเรียบร้อย',
  Returned = 'สินค้าถูกตีกลับ',
}
