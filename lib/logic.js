/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/*
*
*@param {org.supplychain.network.InitiatePO} InitiatePO
*@transaction
*/

async function initiatePurchaseOrder(InitiatePO) {
	cosole.log('Start of Purchase Order function');
	var factory = getFactory();
	var NS = 'org.supplychain.network';

	var me = getCurrentParticipant();

	var order = factory.newResource(NS, 'PO', InitiatePO.orderId);
	order.itemList = InitiatePO;
	if(InitiatePO.orderTotalPrice) {
		order.orderTotalPrice = InitiatePO.orderTotalPrice;
	}

	order.orderStatus = 'INITIATED';
	order.orderer = me;
	order.vendor = InitiatePO.vendor;

	return getAssetRegistry(order.getFullyQualifiedType()).then(function(assetRegistry) {
		return assetRegistry.add(order);
	});
}

/*
*
*@param {org.supplychain.network.TransferCommodity} trade
*@transaction
*/

function transferCommodity(trade) {
  console.log('Start of function Trasfer commodity');
  var NS = 'org.supplychain.network';
  var me = getCurrentParticipant();
  var factory = getFactory();
  
  trade.commodity.issuer = me;
  trade.commodity.owner = trade.newOwner;
  trade.commodity.purchaseOrder = trade.purchaseOrder;
  
  var newTrace = factory.newConcept(NS, 'Trace');
  newTrace.timestamp = new Date();
  newTrace.location = trade.shipperLocation;
  newTrace.company = me;
  trade.commodity.trade.push(newTrace);
  
  return getAssetRegistry(org.supplychain.network.Commodity).then(function(assetRegistry) {
		return assetRegistry.update(trade.commodity);
	});
  
}
