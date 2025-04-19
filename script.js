function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
            
            if (tabName === 'Summary') {
                updateSummary();
            }
        }

        
        // ===== INSERT HELPER FUNCTION HERE =====
        function applyColorClass(elementId, valueElementId) {
            const valueText = document.getElementById(valueElementId).textContent;
            const cell = document.getElementById(elementId);
            cell.textContent = valueText;
            
            // Check if text starts with '-' (now properly formatted)
            cell.className = valueText.startsWith('-') ? 'negative' : 'positive';
        }



        // ===== END OF HELPER FUNCTION =====


        function calculate(platform) {
            // Get input values
            const commission = parseFloat(document.getElementById(`commission-${platform}`).value) / 100;
            const gst = parseFloat(document.getElementById(`gst-${platform}`).value) / 100;
            const grossTxnFee = parseFloat(document.getElementById(`grossTxnFee-${platform}`).value) / 100;
            const nettServiceFee = parseFloat(document.getElementById(`nettServiceFee-${platform}`).value) / 100;
            const discount = parseFloat(document.getElementById(`discount-${platform}`).value) / 100;
            const sellerVouchers = parseFloat(document.getElementById(`sellerVouchers-${platform}`).value);
            const platformVouchers = parseFloat(document.getElementById(`${platform}Vouchers-${platform}`).value);
            const platformCoins = parseFloat(document.getElementById(`${platform}Coins-${platform}`).value);
            const grossPrice = parseFloat(document.getElementById(`grossPrice-${platform}`).value);
            const buyerShipping = parseFloat(document.getElementById(`buyerShipping-${platform}`).value);
            const sellerShipping = parseFloat(document.getElementById(`sellerShipping-${platform}`).value);
            const cogs = parseFloat(document.getElementById(`cogs-${platform}`).value);
            const units = parseInt(document.getElementById(`units-${platform}`).value);
            const boxCost = parseFloat(document.getElementById(`boxCost-${platform}`).value);
            const boxUnits = parseInt(document.getElementById(`boxUnits-${platform}`).value);
            
            // Calculate fields
            const netTxnFeePct = grossTxnFee * (1 + gst);
            const commsBasePrice = grossPrice - (discount * grossPrice) - sellerVouchers;
            const txnBasePrice = commsBasePrice - platformVouchers - platformCoins + buyerShipping;
            const commsFee = commsBasePrice * commission;
            const txnFee = txnBasePrice * netTxnFeePct;
            const serviceFee = (txnBasePrice - buyerShipping)* nettServiceFee;
            
            // Calculate P/L
            const discountAmount = discount * grossPrice;
            const netPrice = grossPrice - discountAmount - sellerVouchers - platformCoins;
            const totalCogs = cogs * units;
            const totalBoxCost = boxCost * boxUnits;
            const grossProfit = netPrice - totalCogs - totalBoxCost;
            const nettProfitLoss = grossProfit - commsFee - txnFee - serviceFee - sellerShipping;
            const netCashFlow = netPrice - commsFee - txnFee - sellerShipping - serviceFee;


            
            // Calculate metrics
            const netProfitPct = (nettProfitLoss / netPrice) * 100;
            const marginPct = (nettProfitLoss / totalCogs) * 100;
            
            // Display results
            document.getElementById(`netTxnFeePct-${platform}`).value = (netTxnFeePct * 100).toFixed(2) + '%';
            document.getElementById(`commsBasePrice-${platform}`).value = '$' + commsBasePrice.toFixed(2);
            document.getElementById(`txnBasePrice-${platform}`).value = '$' + txnBasePrice.toFixed(2);
            document.getElementById(`commsFee-${platform}`).value = '$' + commsFee.toFixed(2);
            document.getElementById(`txnFee-${platform}`).value = '$' + txnFee.toFixed(2);
            document.getElementById(`serviceFee-${platform}`).value = '$' + serviceFee.toFixed(2);
            
            // Display P/L
            document.getElementById(`grossPriceDisplay-${platform}`).textContent = '$' + grossPrice.toFixed(2);
            document.getElementById(`discountAmount-${platform}`).textContent = '$' + discountAmount.toFixed(2);
            document.getElementById(`sellerVouchersDisplay-${platform}`).textContent = '$' + sellerVouchers.toFixed(2);
            document.getElementById(`platformCoinsDisplay-${platform}`).textContent = '$' + platformCoins.toFixed(2);
            //document.getElementById(`netPrice-${platform}`).textContent = '$' + netPrice.toFixed(2);
            document.getElementById(`totalCogs-${platform}`).textContent = '$' + totalCogs.toFixed(2);
            document.getElementById(`totalBoxCost-${platform}`).textContent = '$' + totalBoxCost.toFixed(2);
            //document.getElementById(`grossProfit-${platform}`).textContent = '$' + grossProfit.toFixed(2);
            //document.getElementById(`commsFeeDisplay-${platform}`).textContent = '$' + commsFee.toFixed(2);
            //document.getElementById(`txnFeeDisplay-${platform}`).textContent = '$' + txnFee.toFixed(2);
            document.getElementById(`serviceFeeDisplay-${platform}`).textContent = '$' + serviceFee.toFixed(2);
            document.getElementById(`sellerShippingDisplay-${platform}`).textContent = '$' + sellerShipping.toFixed(2);
            document.getElementById(`netCashFlow-${platform}`).textContent = '$' + netCashFlow.toFixed(2);


        
            document.getElementById(`netPrice-${platform}`).textContent = 
                netPrice < 0 ? '-$' + Math.abs(netPrice).toFixed(2) : '$' + netPrice.toFixed(2);

            document.getElementById(`grossProfit-${platform}`).textContent = 
                grossProfit < 0 ? '-$' + Math.abs(grossProfit).toFixed(2) : '$' + grossProfit.toFixed(2);

            document.getElementById(`txnFeeDisplay-${platform}`).textContent = 
                txnFee <0 ? '-$' + Math.abs(txnFee).toFixed(2) : '$' + txnFee.toFixed(2);

            document.getElementById(`commsFeeDisplay-${platform}`).textContent = 
                commsFee <0 ? '-$' + Math.abs(commsFee).toFixed(2) : '$' + commsFee.toFixed(2);

            
            // Set color based on profit/loss
            const profitLossElement = document.getElementById(`nettProfitLoss-${platform}`);
            profitLossElement.textContent = '$' + Math.abs(nettProfitLoss).toFixed(2);
            if (nettProfitLoss >= 0) {
                profitLossElement.className = 'report-value positive';
            } else {
                profitLossElement.className = 'report-value negative';
                profitLossElement.textContent = '-$' + Math.abs(nettProfitLoss).toFixed(2);
            }
            

            // Set color based on Cashflow
            const cashFlowElement = document.getElementById(`netCashFlow-${platform}`);
            if (netCashFlow >= 0) {
                cashFlowElement.className = 'report-value positive';
            } else {
                cashFlowElement.className = 'report-value negative';
                cashFlowElement.textContent = '-$' + Math.abs(netCashFlow).toFixed(2);
            }

            // Display metrics
            const netProfitPctElement = document.getElementById(`netProfitPct-${platform}`);
            netProfitPctElement.textContent = netProfitPct.toFixed(0) + '%';
            netProfitPctElement.className = netProfitPct >= 0 ? 'metric-value positive' : 'metric-value negative';
            
            const marginPctElement = document.getElementById(`marginPct-${platform}`);
            marginPctElement.textContent = marginPct.toFixed(0) + '%';
            marginPctElement.className = marginPct >= 0 ? 'metric-value positive' : 'metric-value negative';
            
            // Update summary if it's visible
            if (document.getElementById('Summary').style.display === 'block') {
                updateSummary();
            }
        }


        function resetTab(platform) {
            // Define default values for each platform
            const defaults = {
                shopee: {
                    grossPrice: 16,
                    discount: 10,
                    cogs: 0.75,
                    units: 6,
                    boxCost: 0.44,
                    boxUnits: 1,
                    gst: 9,
                    commission: 7.63,
                    grossTxnFee: 3,
                    nettServiceFee: 3.27,
                    sellerVouchers: 0,
                    shopeeVouchers: 0,
                    shopeeCoins: 0,
                    buyerShipping: 1.99,
                    sellerShipping: 2.03
                },
                lazada: {
                    grossPrice: 16,
                    discount: 5,
                    cogs: 0.75,
                    units: 6,
                    boxCost: 0.44,
                    boxUnits: 1,
                    gst: 9,
                    commission: 4.36,
                    grossTxnFee: 2,
                    nettServiceFee: 0,
                    sellerVouchers: 0,
                    lazadaVouchers: 0,
                    lazadaCoins: 0,
                    buyerShipping: 1.99,
                    sellerShipping: 1.53
                },
                tiktok: {
                    grossPrice: 16,
                    discount: 15,
                    cogs: 0.75,
                    units: 6,
                    boxCost: 0.44,
                    boxUnits: 1,
                    gst: 9,
                    commission: 4.905,
                    grossTxnFee: 2,
                    nettServiceFee: 0,
                    sellerVouchers: 0,
                    tiktokVouchers: 0,
                    tiktokCoins: 0,
                    buyerShipping: 1.99,
                    sellerShipping: 1.53
                }
            };

            // Reset all fields to their default values
            const platformDefaults = defaults[platform];
            for (const [key, value] of Object.entries(platformDefaults)) {
                const element = document.getElementById(`${key}-${platform}`);
                if (element) {
                    element.value = value;
                }
            }

            // Recalculate the tab after reset
            calculate(platform);
        }


        
        function updateSummary() {
            const platforms = ['shopee', 'lazada', 'tiktok'];
            
            platforms.forEach(platform => {
                // Update header values
                document.getElementById(`summary-grossPrice-${platform}`).textContent = 
                    document.getElementById(`grossPriceDisplay-${platform}`).textContent;
                document.getElementById(`summary-discount-${platform}`).textContent = 
                    document.getElementById(`discountAmount-${platform}`).textContent;


                // Color-coded updates (using the helper function)
                applyColorClass(`summary-netPrice-${platform}`, `netPrice-${platform}`);
                applyColorClass(`summary-grossProfit-${platform}`, `grossProfit-${platform}`);
                applyColorClass(`summary-nettProfitLoss-${platform}`, `nettProfitLoss-${platform}`);
                applyColorClass(`summary-netProfitPct-${platform}`, `netProfitPct-${platform}`);
                applyColorClass(`summary-netCashFlow-${platform}`, `netCashFlow-${platform}`);
                applyColorClass(`summary-marginPct-${platform}`, `marginPct-${platform}`);



                // Update other metrics
                document.getElementById(`summary-netProfitPct-${platform}`).textContent = 
                    document.getElementById(`netProfitPct-${platform}`).textContent;
                document.getElementById(`summary-marginPct-${platform}`).textContent = 
                    document.getElementById(`marginPct-${platform}`).textContent;
                document.getElementById(`summary-commsFee-${platform}`).textContent = 
                    document.getElementById(`commsFeeDisplay-${platform}`).textContent;
                document.getElementById(`summary-txnFee-${platform}`).textContent = 
                    document.getElementById(`txnFeeDisplay-${platform}`).textContent;
                document.getElementById(`summary-serviceFee-${platform}`).textContent = 
                    document.getElementById(`serviceFeeDisplay-${platform}`).textContent;
                document.getElementById(`summary-sellerShipping-${platform}`).textContent = 
                    document.getElementById(`sellerShippingDisplay-${platform}`).textContent;

 

                


                
            });


        }



        function handleFixedCalculate() {
          // Get active tab
          const activeTab = document.querySelector('.tabcontent[style*="display: block"], .tabcontent[style*="display:block"]');
          
          if (activeTab) {
            const platform = activeTab.id.toLowerCase();
            calculate(platform);
          }
        }

        function handleFixedReset() {
          // Get active tab
          const activeTab = document.querySelector('.tabcontent[style*="display: block"], .tabcontent[style*="display:block"]');
          
          if (activeTab) {
            const platform = activeTab.id.toLowerCase();
            resetTab(platform);
          }
        } 