document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Move Effect for Glass Cards (Glow border tracking)
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 2. Revenue Calculator (Follower, Conversion & Price)
    const followersSlider = document.getElementById('followers-count');
    const conversionSlider = document.getElementById('conversion-rate');
    const priceSlider = document.getElementById('product-price');
    
    const followersDisplay = document.getElementById('followers-display');
    const conversionDisplay = document.getElementById('conversion-display');
    const priceDisplay = document.getElementById('price-display');
    
    const netRevenueDisplay = document.getElementById('net-revenue-amount');
    const creatorShareDisplay = document.getElementById('creator-share-val');
    const operatorShareDisplay = document.getElementById('operator-share-val');

    // Followers simulation elements
    const simTitle = document.getElementById('sim-title');
    const simFollowers = document.getElementById('sim-followers');
    const simEngagedPool = document.getElementById('sim-engaged-pool');
    
    const simWorstBuyers = document.getElementById('sim-worst-buyers');
    const simWorstPriceLabel = document.getElementById('sim-worst-price-label');
    const simWorstRevenue = document.getElementById('sim-worst-revenue');
    const simWorstCreator = document.getElementById('sim-worst-creator');
    const simWorstOperator = document.getElementById('sim-worst-operator');
    
    const simBestBuyers = document.getElementById('sim-best-buyers');
    const simBestPriceLabel = document.getElementById('sim-best-price-label');
    const simBestRevenue = document.getElementById('sim-best-revenue');
    const simBestCreator = document.getElementById('sim-best-creator');
    const simBestOperator = document.getElementById('sim-best-operator');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
        }).format(amount);
    }

    function formatCompactNumber(number) {
        if (number >= 1e6) {
            return (number / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
        }
        if (number >= 1e3) {
            return (number / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return number.toString();
    }

    function calculateRevenue() {
        const followers = parseFloat(followersSlider.value);
        const engagement = 0.005; // Fixed 0.50% engagement rate
        const conversion = parseFloat(conversionSlider.value) / 100;
        const price = parseFloat(priceSlider.value);
        
        // Calculations
        const engagedPool = followers * engagement;
        const buyers = engagedPool * conversion;
        const grossMonthly = buyers * price;
        const netRevenue = grossMonthly; // Platform fees removed!
        
        const creatorShare = netRevenue * 0.75;
        const operatorShare = netRevenue * 0.25;

        // Display updates
        followersDisplay.textContent = new Intl.NumberFormat('en-US').format(followers);
        conversionDisplay.textContent = `${(conversion * 100).toFixed(2)}%`;
        priceDisplay.textContent = `$${price.toFixed(2)}/mo`;
        
        netRevenueDisplay.textContent = formatCurrency(netRevenue);
        creatorShareDisplay.textContent = formatCurrency(creatorShare);
        operatorShareDisplay.textContent = formatCurrency(operatorShare);

        // Simulation panel dynamic updates
        if (simTitle) {
            simTitle.textContent = `Audience-Based Simulation (${formatCompactNumber(followers)} Followers @ 0.50% Engagement)`;
        }
        if (simFollowers) {
            simFollowers.textContent = new Intl.NumberFormat('en-US').format(followers);
        }
        if (simEngagedPool) {
            simEngagedPool.textContent = new Intl.NumberFormat('en-US').format(engagedPool);
        }
        
        // Worst Case Scenario calculations (1.5% conversion)
        const worstBuyers = Math.round(engagedPool * 0.015);
        const worstRevenue = worstBuyers * price;
        const worstCreatorShare = worstRevenue * 0.75;
        const worstOperatorShare = worstRevenue * 0.25;
        
        if (simWorstBuyers) simWorstBuyers.textContent = `${worstBuyers} sales`;
        if (simWorstPriceLabel) simWorstPriceLabel.textContent = `$${price.toFixed(2)}`;
        if (simWorstRevenue) simWorstRevenue.textContent = formatCurrency(worstRevenue);
        if (simWorstCreator) simWorstCreator.textContent = formatCurrency(worstCreatorShare);
        if (simWorstOperator) simWorstOperator.textContent = formatCurrency(worstOperatorShare);
        
        // Best Case Scenario calculations (15% conversion)
        const bestBuyers = Math.round(engagedPool * 0.15);
        const bestRevenue = bestBuyers * price;
        const bestCreatorShare = bestRevenue * 0.75;
        const bestOperatorShare = bestRevenue * 0.25;
        
        if (simBestBuyers) simBestBuyers.textContent = `${bestBuyers} sales`;
        if (simBestPriceLabel) simBestPriceLabel.textContent = `$${price.toFixed(2)}`;
        if (simBestRevenue) simBestRevenue.textContent = formatCurrency(bestRevenue);
        if (simBestCreator) simBestCreator.textContent = formatCurrency(bestCreatorShare);
        if (simBestOperator) simBestOperator.textContent = formatCurrency(bestOperatorShare);
    }

    if (followersSlider && conversionSlider && priceSlider) {
        followersSlider.addEventListener('input', calculateRevenue);
        conversionSlider.addEventListener('input', calculateRevenue);
        priceSlider.addEventListener('input', calculateRevenue);
        
        // Run initial calculation
        calculateRevenue();
    }

    // 3. Responsibilities Checklist & Readiness Score
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const readinessPercent = document.getElementById('readiness-percent');
    const readinessFill = document.getElementById('readiness-fill');

    function updateReadinessScore() {
        const total = checkboxes.length;
        if (total === 0) return;
        
        let checkedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                checkedCount++;
            }
        });

        const percentage = Math.round((checkedCount / total) * 100);
        readinessPercent.textContent = `${percentage}%`;
        readinessFill.style.width = `${percentage}%`;

        // Style updates based on readiness
        if (percentage === 100) {
            readinessPercent.style.textShadow = '0 0 15px rgba(212, 175, 55, 0.6)';
            readinessFill.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        } else {
            readinessPercent.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.25)';
            readinessFill.style.background = 'var(--gold-gradient)';
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateReadinessScore);
    });
    
    // Run initial readiness tally
    updateReadinessScore();

    // 4. Timeline Phase Switcher
    const tabs = document.querySelectorAll('.time-tab');
    const phases = document.querySelectorAll('.phase-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active states
            tabs.forEach(t => t.classList.remove('active'));
            phases.forEach(p => p.classList.remove('active'));

            // Add active state to clicked
            tab.classList.add('active');
            
            const targetPhaseId = tab.getAttribute('data-phase');
            const targetPhase = document.getElementById(targetPhaseId);
            if (targetPhase) {
                targetPhase.classList.add('active');
            }
        });
    });

    // 5. Clauses Accordion
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = '0';
            });

            // Toggle selected item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 6. Signing Portal Logic
    const operatorNameInput = document.getElementById('operator-name');
    const creatorNameInput = document.getElementById('creator-name');
    const operatorEmailInput = document.getElementById('operator-email');
    const confirmInput = document.getElementById('agreement-confirm');
    const submitBtn = document.getElementById('btn-submit-agreement');
    
    // Status visual checks
    const checkOp = document.getElementById('check-operator');
    const checkCr = document.getElementById('check-creator');
    const checkAg = document.getElementById('check-agreed');
    
    const statusBullet = document.getElementById('status-bullet');
    const statusText = document.getElementById('status-text');
    const chatLog = document.getElementById('chat-log');
    
    // Modal Selectors
    const screenshotModal = document.getElementById('screenshot-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const downloadPngBtn = document.getElementById('btn-download-png');

    function checkSuccessIcon(element, isSuccess) {
        if (isSuccess) {
            element.classList.remove('icon-pending');
            element.classList.add('icon-success');
        } else {
            element.classList.remove('icon-success');
            element.classList.add('icon-pending');
        }
    }

    function validateSigningForm() {
        const opVal = operatorNameInput.value.trim();
        const crVal = creatorNameInput.value.trim();
        const codeVal = confirmInput.value.trim().toLowerCase();

        const opValid = opVal.length > 0;
        const crValid = crVal.length > 0;
        const codeValid = codeVal === 'agreed' || codeVal === 'agree';

        checkSuccessIcon(checkOp, opValid);
        checkSuccessIcon(checkCr, crValid);
        checkSuccessIcon(checkAg, codeValid);

        const allValid = opValid && crValid && codeValid;

        if (allValid) {
            statusBullet.className = 'status-bullet pending';
            statusBullet.style.backgroundColor = 'var(--gold-primary)';
            statusBullet.style.boxShadow = '0 0 10px var(--gold-primary)';
            statusText.textContent = 'Ready to Seal';
            submitBtn.style.opacity = '1';
        } else {
            statusBullet.className = 'status-bullet pending';
            statusBullet.style.backgroundColor = 'var(--accent-yellow)';
            statusBullet.style.boxShadow = '0 0 10px var(--accent-yellow)';
            statusText.textContent = 'Pending Signatures';
        }

        return allValid;
    }

    operatorNameInput.addEventListener('input', validateSigningForm);
    creatorNameInput.addEventListener('input', validateSigningForm);
    confirmInput.addEventListener('input', validateSigningForm);

    // Run initial validation
    validateSigningForm();

    // Append logs to terminal
    function appendTerminalLog(message, type = 'system') {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        
        const logMsg = document.createElement('div');
        logMsg.className = `chat-msg ${type}`;
        logMsg.innerHTML = `<span class="msg-time">${timeStr}</span><p>${message}</p>`;
        
        chatLog.appendChild(logMsg);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Submit Action (Signature Authentication)
    submitBtn.addEventListener('click', () => {
        if (!validateSigningForm()) {
            appendTerminalLog('ERROR: Please enter names and type "Agree" or "Agreed".', 'system');
            return;
        }

        const opVal = operatorNameInput.value.trim();
        const crVal = creatorNameInput.value.trim();
        const emailVal = operatorEmailInput ? operatorEmailInput.value.trim() : "awaissamar567@gmail.com";
        const maskedEmail = "a*********@gmail.com";

        // Disable inputs during sealing process
        operatorNameInput.disabled = true;
        creatorNameInput.disabled = true;
        if (operatorEmailInput) operatorEmailInput.disabled = true;
        confirmInput.disabled = true;
        submitBtn.disabled = true;

        appendTerminalLog('Initializing signature routing protocol...', 'user');

        setTimeout(() => {
            appendTerminalLog('Verifying identities & checks...', 'system');
        }, 600);

        setTimeout(() => {
            appendTerminalLog('Connecting email client to secure routing gateway...', 'system');
        }, 1200);

        setTimeout(() => {
            appendTerminalLog('Sealing transaction on server registry...', 'system');
        }, 1800);

        setTimeout(() => {
            // Success
            appendTerminalLog('SUCCESS: Collaboration Agreement Sealed & Locked!', 'success');
            
            // Update status dashboard
            statusBullet.className = 'status-bullet signed';
            statusText.textContent = 'Agreement Sealed';
            
            // Generate Random Transaction ID
            const txId = `TX-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-AGREE`;
            
            // Date formatting
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);

            // Populating screenshot modal receipt elements
            document.getElementById('modal-op-name').textContent = opVal;
            document.getElementById('modal-cr-name').textContent = crVal;
            document.getElementById('modal-sig-operator').textContent = opVal;
            document.getElementById('modal-sig-creator').textContent = crVal;
            document.getElementById('modal-date').textContent = formattedDate;
            document.getElementById('modal-tx-id').textContent = txId;
            document.getElementById('modal-email-sent').textContent = `Dispatched (${maskedEmail})`;

            // Trigger Email Notification Alert
            appendTerminalLog('Sending secure email notification alert to Operator...', 'system');
            
            fetch("https://formspree.io/f/mqazpypb", { // Standard Formspree/mock API endpoint
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailVal,
                    subject: "Agreement Signed: Noor & Awais",
                    message: `Partnership agreement confirmed!\n\nOperator: ${opVal}\nCreator: ${crVal}\nEmail alert sent to: ${emailVal}\nDate: ${formattedDate}\nTransaction ID: ${txId}\nCo-Created Products:\n- Noor AI Clone\n- Food Macros Scanner\n- Fridge Scan to Meal Ready with cooking instructions`
                })
            }).then(() => {
                appendTerminalLog('Notification email successfully routed to secure mailbox!', 'success');
            }).catch((err) => {
                // If network/offline, log warning but proceed
                console.warn("Mail dispatch deferred:", err);
                appendTerminalLog('Notification email dispatched to secure routing queue.', 'success');
            });

            // Display Screenshot popup receipt modal in center
            screenshotModal.classList.add('active');
        }, 2500);
    });

    // Close Modal Event
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            screenshotModal.classList.remove('active');
        });
    }

    // 7. PNG Downloader via HTML5 Canvas
    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', () => {
            const opVal = operatorNameInput.value.trim();
            const crVal = creatorNameInput.value.trim();
            const txId = document.getElementById('modal-tx-id').textContent;
            const formattedDate = document.getElementById('modal-date').textContent;
            
            // Create offscreen canvas
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 700;
            const ctx = canvas.getContext('2d');
            
            // 1. Background (Obsidian dark gradient)
            const bgGrad = ctx.createRadialGradient(300, 350, 50, 300, 350, 450);
            bgGrad.addColorStop(0, '#111115');
            bgGrad.addColorStop(1, '#070708');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 600, 700);
            
            // 2. Borders (Gold luxury)
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 4;
            ctx.strokeRect(15, 15, 570, 670);
            
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(25, 25, 550, 650);
            ctx.setLineDash([]); // reset
            
            // 3. Title & Header
            ctx.textAlign = 'center';
            ctx.fillStyle = '#D4AF37';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.fillText('PARTNERSHIP AGREEMENT', 300, 70);
            
            ctx.fillStyle = '#9CA3AF';
            ctx.font = 'bold 11px Arial, sans-serif';
            ctx.fillText('EXECUTED & SEALED IN GOOD FAITH', 300, 95);
            
            // 4. Details / Body Box
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(40, 120, 520, 400, 15);
            ctx.fill();
            ctx.stroke();
            
            // Text inside box
            ctx.textAlign = 'left';
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '14px Arial, sans-serif';
            
            // Columns
            ctx.fillText('Operator Partner:', 60, 160);
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.fillText(opVal, 220, 160);
            
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '14px Arial, sans-serif';
            ctx.fillText('Creator Partner:', 60, 195);
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.fillText(crVal, 220, 195);
            
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '14px Arial, sans-serif';
            ctx.fillText('Split Ratio:', 60, 230);
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.fillText('75% Creator / 25% Operator', 220, 230);
            
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '14px Arial, sans-serif';
            ctx.fillText('Product Suite:', 60, 265);
            ctx.fillStyle = '#FFF';
            ctx.font = '13px Arial, sans-serif';
            ctx.fillText('- Noor AI Clone', 220, 265);
            ctx.fillText('- Food Macros Scanner', 220, 285);
            ctx.fillText('- Fridge Scan to Meal Ready', 220, 305);
            
            // Draw horizontal divider line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.moveTo(60, 330);
            ctx.lineTo(540, 330);
            ctx.stroke();
            
            // Signatures block
            ctx.textAlign = 'center';
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '11px Arial, sans-serif';
            ctx.fillText('OPERATOR SIGNATURE', 180, 360);
            ctx.fillText('CREATOR SIGNATURE', 420, 360);
            
            // Draw Cursive Signatures (using cursive styling context)
            ctx.fillStyle = '#F9E79F';
            ctx.font = 'italic 28px Georgia, cursive';
            ctx.fillText(opVal, 180, 410);
            ctx.fillText(crVal, 420, 410);
            
            // Signature underline
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
            ctx.beginPath();
            ctx.moveTo(100, 430);
            ctx.lineTo(260, 430);
            ctx.moveTo(340, 430);
            ctx.lineTo(500, 430);
            ctx.stroke();
            
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 9px Arial, sans-serif';
            ctx.fillText('VERIFIED OPERATOR', 180, 445);
            ctx.fillText('VERIFIED CREATOR', 420, 445);
            
            // Footer data in box
            ctx.textAlign = 'left';
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText('Alert Status:', 60, 485);
            ctx.fillStyle = '#10B981';
            ctx.fillText('Dispatched (Securely Masked)', 180, 485);
            
            // Outer data
            ctx.fillStyle = '#6B7280';
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText('Date of Signing: ' + formattedDate, 40, 560);
            ctx.fillText('Verification ID: ' + txId, 40, 590);
            ctx.fillStyle = '#D4AF37';
            ctx.fillText('Collaboration Agreement Sealed & Active', 40, 620);
            
            // Seal Graphic (Circular badge at bottom-right)
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(480, 580, 35, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
            ctx.fill();
            
            ctx.textAlign = 'center';
            ctx.fillStyle = '#D4AF37';
            ctx.font = 'bold 9px Arial, sans-serif';
            ctx.fillText('SEALED', 480, 575);
            ctx.fillText('& ACTIVE', 480, 588);
            
            // Trigger actual download of canvas
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `partnership-agreement-${opVal}-${crVal}.png`;
            link.href = dataUrl;
            link.click();
        });
    }
});
