export type AccountTitle = {
  id: number;
  code: string;
  name: string;
  category: "asset" | "liability" | "equity" | "revenue" | "expense";
};

export const assetAccounts: AccountTitle[] = [
  { id: 1, code: "100", name: "現金", category: "asset" },
  { id: 2, code: "101", name: "普通預金", category: "asset" },
  { id: 3, code: "140", name: "売掛金", category: "asset" },
];

export const liabilityAccounts: AccountTitle[] = [
  { id: 4, code: "440", name: "買掛金", category: "liability" },
];

export const equityAccounts: AccountTitle[] = [
  { id: 5, code: "300", name: "元入金", category: "equity" },
  { id: 6, code: "302", name: "事業主借", category: "equity" },
  { id: 7, code: "303", name: "事業主貸", category: "equity" },
];

export const revenueAccounts: AccountTitle[] = [
  { id: 8, code: "700", name: "売上高", category: "revenue" },
];

export const expenseAccounts: AccountTitle[] = [
  { id: 9, code: "500", name: "消耗品費", category: "expense" },
  { id: 10, code: "501", name: "通信費", category: "expense" },
  { id: 11, code: "502", name: "旅費交通費", category: "expense" },
  { id: 12, code: "503", name: "水道光熱費", category: "expense" },
  { id: 13, code: "504", name: "地代家賃", category: "expense" },
  { id: 14, code: "505", name: "支払手数料", category: "expense" },
];

// 全部まとめたもの
export const accountTitles: AccountTitle[] = [
  ...assetAccounts,
  ...liabilityAccounts,
  ...equityAccounts,
  ...revenueAccounts,
  ...expenseAccounts,
];