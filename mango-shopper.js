export default function MangoShopper(db) {
	

	async function createShop(shopName) {
		const result = await db.one(`INSERT INTO shop(name) VALUES ('${shopName}') RETURNING id`);
		return result.id;
	}

	async function listShops() {
		let shops = await db.manyOrNone('SELECT * FROM shop;');
		return shops;
	}

	async function dealsForShop(shopId) {
		let mango_deals = await db.manyOrNone(`SELECT shop.name as shop_name, qty, price FROM  mango_deal  inner join shop on shop_id=shop.id where shop_id = ${shopId};`);
		return mango_deals;
	}

	async function topFiveDeals() {     
		let topFiveDeal = await db.manyOrNone(`SELECT *FROM mango_deal ORDER BY qty DESC, price ASC LIMIT 5`)
		return topFiveDeal
	}

	async function createDeal(shopId, qty, price) {
		const result = await db.one(`INSERT INTO  mango_deal(shop_id, qty, price) VALUES (${shopId}, ${qty}, ${price}) RETURNING id`);
		return result.id;
	}

	async function recommendDeals(amount) {
	     
	}

	return {
		createDeal,
		createShop,
		listShops,
		dealsForShop,
		recommendDeals,
		topFiveDeals
	}


}