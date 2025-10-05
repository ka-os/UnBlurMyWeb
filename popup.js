document.getElementById('toggleBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: removeBlur
  });
  
  document.getElementById('status').textContent = 'Blur removed & page cleaned!';
  
  setTimeout(() => {
    document.getElementById('status').textContent = 'Ready to use';
  }, 2000);
});

function removeBlur() {
  console.log('=== Blur Remover Extension Started ===');
  
  const elements = document.querySelectorAll('*');
  let count = 0;
  
  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    
    if (computedStyle.filter && computedStyle.filter !== 'none' && computedStyle.filter.includes('blur')) {
      element.style.filter = computedStyle.filter.replace(/blur\([^)]*\)/g, '').trim();
      if (element.style.filter === '' || element.style.filter === ' ') {
        element.style.filter = 'none';
      }
      count++;
    }
    
    if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none' && computedStyle.backdropFilter.includes('blur')) {
      element.style.backdropFilter = computedStyle.backdropFilter.replace(/blur\([^)]*\)/g, '').trim();
      if (element.style.backdropFilter === '' || element.style.backdropFilter === ' ') {
        element.style.backdropFilter = 'none';
      }
      count++;
    }
  });
  
  const styleSheets = document.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.style) {
          if (rule.style.filter && rule.style.filter.includes('blur')) {
            rule.style.filter = rule.style.filter.replace(/blur\([^)]*\)/g, '').trim();
            if (rule.style.filter === '' || rule.style.filter === ' ') {
              rule.style.filter = 'none';
            }
          }
          if (rule.style.backdropFilter && rule.style.backdropFilter.includes('blur')) {
            rule.style.backdropFilter = rule.style.backdropFilter.replace(/blur\([^)]*\)/g, '').trim();
            if (rule.style.backdropFilter === '' || rule.style.backdropFilter === ' ') {
              rule.style.backdropFilter = 'none';
            }
          }
        }
      }
    } catch (e) {
    }
  }
  
  console.log('=== Now searching for sales-gate divs ===');
  let removedCount = 0;
 
  const salesGateDivs = document.querySelectorAll('.floating-paywall.scroll-up');
  console.log('Found sales-gate divs:', salesGateDivs.length);

  salesGateDivs.forEach(element => {
    console.log('Removing sales-gate div:', element.className);
    element.remove();
    removedCount++;
  });
  
  console.log(`Blur Remover: Processed ${count} blur elements, removed ${removedCount} sales gates`);
}
