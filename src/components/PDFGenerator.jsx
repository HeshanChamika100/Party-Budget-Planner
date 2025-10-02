import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFGenerator = ({ 
  items, 
  people = [],
  alcoholicPeople, 
  nonAlcoholicPeople, 
  totalCost, 
  totalAlcoholicCost, 
  totalNonAlcoholicCost, 
  alcoholicCostPerPerson, 
  nonAlcoholicCostPerPerson,
  darkMode = false
}) => {
  const totalPeople = alcoholicPeople + nonAlcoholicPeople;

  // JPG Generation Function
  const generateJPGReport = async () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Create a temporary div for the report
    const reportElement = document.createElement('div');
    reportElement.style.cssText = `
      width: 800px;
      background: white;
      padding: 40px;
      font-family: Arial, sans-serif;
      position: fixed;
      top: -9999px;
      left: -9999px;
    `;

    reportElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
          🎉 PARTY BUDGET REPORT
        </h1>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Generated on: ${currentDate} at ${currentTime}
        </p>
        <div style="height: 2px; background: linear-gradient(to right, #7c3aed, #ec4899); margin: 20px 0;"></div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #7c3aed; padding-left: 15px;">
          📊 BUDGET SUMMARY
        </h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">👥 Total People</div>
              <div style="color: #333; font-size: 20px; font-weight: bold;">${totalPeople}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">💰 Total Cost</div>
              <div style="color: #7c3aed; font-size: 20px; font-weight: bold;">Rs.${totalCost.toLocaleString()}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">🍺 Alcoholic (${alcoholicPeople})</div>
              <div style="color: #7c3aed; font-size: 16px; font-weight: bold;">Rs.${totalAlcoholicCost.toLocaleString()}</div>
              ${alcoholicPeople > 0 ? `<div style="color: #666; font-size: 10px;">Per person: Rs.${alcoholicCostPerPerson.toLocaleString()}</div>` : ''}
            </div>
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">🥤 Non-Alcoholic (${nonAlcoholicPeople})</div>
              <div style="color: #059669; font-size: 16px; font-weight: bold;">Rs.${totalNonAlcoholicCost.toLocaleString()}</div>
              ${nonAlcoholicPeople > 0 ? `<div style="color: #666; font-size: 10px;">Per person: Rs.${nonAlcoholicCostPerPerson.toLocaleString()}</div>` : ''}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #7c3aed; padding-left: 15px;">
          🛍️ PARTY ITEMS BREAKDOWN
        </h2>
        <div style="overflow: hidden; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 15px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 12px; font-weight: bold; font-size: 13px;">
            <div>Item Name</div>
            <div style="text-align: center;">Type</div>
            <div style="text-align: center;">Unit Price (Rs.)</div>
            <div style="text-align: center;">Quantity</div>
            <div style="text-align: center;">Total (Rs.)</div>
          </div>
          ${items.map((item, index) => {
            const itemTotal = item.unitPrice * item.quantity;
            const itemName = item.name || `Item ${index + 1}`;
            const itemType = item.isAlcoholic ? '🍺 Alcoholic' : '🥤 Non-Alc';
            const bgColor = item.isAlcoholic ? '#fdf4ff' : index % 2 === 0 ? '#ffffff' : '#f8fafc';
            return `
              <div style="padding: 12px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 12px; border-bottom: 1px solid #e2e8f0; background: ${bgColor};">
                <div style="font-weight: 500;">${itemName}</div>
                <div style="text-align: center; font-size: 12px;">${itemType}</div>
                <div style="text-align: center;">${item.unitPrice.toLocaleString()}</div>
                <div style="text-align: center;">${item.quantity}</div>
                <div style="text-align: center; font-weight: bold; color: ${item.isAlcoholic ? '#7c3aed' : '#059669'};">${itemTotal.toLocaleString()}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #7c3aed; padding-left: 15px;">
          👥 PARTY PEOPLE
        </h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            ${(() => {
              const alcoholicPeopleList = people.filter(person => person.isAlcoholic);
              const nonAlcoholicPeopleList = people.filter(person => !person.isAlcoholic);
              
              let leftColumn = '';
              let rightColumn = '';
              
              if (alcoholicPeopleList.length > 0) {
                leftColumn = `
                  <div>
                    <div style="color: #7c3aed; font-weight: bold; font-size: 14px; margin-bottom: 8px;">🍺 Alcoholic People:</div>
                    <div style="color: #333; font-size: 13px; line-height: 1.5;">${alcoholicPeopleList.map(person => person.name || 'Unnamed').join(', ')}</div>
                  </div>
                `;
              } else {
                leftColumn = '<div style="color: #666; font-style: italic;">No alcoholic people</div>';
              }
              
              if (nonAlcoholicPeopleList.length > 0) {
                rightColumn = `
                  <div>
                    <div style="color: #059669; font-weight: bold; font-size: 14px; margin-bottom: 8px;">🥤 Non-Alcoholic People:</div>
                    <div style="color: #333; font-size: 13px; line-height: 1.5;">${nonAlcoholicPeopleList.map(person => person.name || 'Unnamed').join(', ')}</div>
                  </div>
                `;
              } else {
                rightColumn = '<div style="color: #666; font-style: italic;">No non-alcoholic people</div>';
              }
              
              return leftColumn + rightColumn;
            })()
            }
          </div>
        </div>
      </div>

      <div style="border-top: 2px solid #333; padding-top: 20px; margin-top: 30px;">
        <div style="text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 20px;">
            GRAND TOTAL: Rs.${totalCost.toLocaleString()}
          </div>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h3 style="color: #475569; font-size: 14px; margin-bottom: 15px; font-weight: bold;">ADDITIONAL INFORMATION:</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 12px; color: #64748b;">
            <div>• Total number of items: ${items.length}</div>
            <div>• Alcoholic people: ${alcoholicPeople} (Cost per person: Rs.${alcoholicPeople > 0 ? alcoholicCostPerPerson.toLocaleString() : '0'})</div>
            <div>• Non-alcoholic people: ${nonAlcoholicPeople} (Cost per person: Rs.${nonAlcoholicPeople > 0 ? nonAlcoholicCostPerPerson.toLocaleString() : '0'})</div>
            <div>• Generated by Party Budget Planner</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(reportElement);

    try {
      const canvas = await html2canvas(reportElement, {
        width: 800,
        height: reportElement.scrollHeight,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      // Convert canvas to JPG and download
      const link = document.createElement('a');
      link.download = `Party-Budget-Report-${currentDate.replace(/\//g, '-')}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      document.body.removeChild(reportElement);
    } catch (error) {
      console.error('Error generating JPG report:', error);
      document.body.removeChild(reportElement);
    }
  };

  // PDF Generation Function
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Set up the document with proper encoding
    doc.setFontSize(20);
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text('PARTY BUDGET REPORT', 20, 30);

    // Add date and time
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 20, 45);

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50);

    // Summary section - more compact
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('BUDGET SUMMARY', 20, 65);

    // Create a more compact layout using columns
    doc.setFontSize(10);
    
    // Left column - People & Total Cost
    doc.text(`Total People: ${totalPeople} (Alcoholic: ${alcoholicPeople}, Non-Alcoholic: ${nonAlcoholicPeople})`, 20, 78);
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 0);
    doc.text(`Total Cost: Rs.${totalCost.toLocaleString()}`, 20, 90);
    
    // Costs breakdown in two columns
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Alcoholic Cost: Rs.${totalAlcoholicCost.toLocaleString()}`, 20, 105);
    if (alcoholicPeople > 0) {
      doc.text(`Per person: Rs.${alcoholicCostPerPerson.toLocaleString()}`, 110, 105);
    }
    
    doc.text(`Non-Alcoholic Cost: Rs.${totalNonAlcoholicCost.toLocaleString()}`, 20, 115);
    if (nonAlcoholicPeople > 0) {
      doc.text(`Per person: Rs.${nonAlcoholicCostPerPerson.toLocaleString()}`, 110, 115);
    }

    // Items section - moved up due to compact summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('PARTY ITEMS BREAKDOWN', 20, 135);

    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(128, 0, 128);
    doc.text('Item Name', 20, 150);
    doc.text('Type', 70, 150);
    doc.text('Unit Price (Rs.)', 100, 150);
    doc.text('Quantity', 140, 150);
    doc.text('Total (Rs.)', 165, 150);

    // Add line under headers
    doc.setDrawColor(128, 0, 128);
    doc.line(20, 153, 190, 153);

    // Add items
    doc.setTextColor(0, 0, 0);
    let yPosition = 165;
    
    items.forEach((item, index) => {
      if (yPosition > 260) { // Check if we need a new page
        doc.addPage();
        // Add header on new page
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PARTY ITEMS BREAKDOWN (Continued)', 20, 30);
        
        // Table headers on new page
        doc.setFontSize(10);
        doc.setTextColor(128, 0, 128);
        doc.text('Item Name', 20, 40);
        doc.text('Type', 70, 40);
        doc.text('Unit Price (Rs.)', 100, 40);
        doc.text('Quantity', 140, 40);
        doc.text('Total (Rs.)', 165, 40);
        doc.setDrawColor(128, 0, 128);
        doc.line(20, 43, 190, 43);
        
        yPosition = 55;
        doc.setTextColor(0, 0, 0);
      }
      
      const itemTotal = item.unitPrice * item.quantity;
      const itemName = item.name || `Item ${index + 1}`;
      
      // Truncate long item names if necessary
      const truncatedName = itemName.length > 20 ? itemName.substring(0, 17) + '...' : itemName;
      
      doc.setFontSize(10);
      doc.text(truncatedName, 20, yPosition);
      doc.text(item.isAlcoholic ? 'Alcoholic' : 'Non-Alc', 70, yPosition);
      doc.text(item.unitPrice.toLocaleString(), 100, yPosition);
      doc.text(item.quantity.toString(), 140, yPosition);
      doc.text(itemTotal.toLocaleString(), 165, yPosition);
      yPosition += 12;
    });

    // Add people section - side by side format
    yPosition += 20;
    
    // Check if we need a new page for people section
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('PARTY PEOPLE', 20, yPosition);
    yPosition += 15;
    
    // Group people by alcoholic preference
    const alcoholicPeopleList = people.filter(person => person.isAlcoholic);
    const nonAlcoholicPeopleList = people.filter(person => !person.isAlcoholic);
    
    doc.setFontSize(10);
    const startYPosition = yPosition;
    
    // Left column - Alcoholic people
    if (alcoholicPeopleList.length > 0) {
      doc.setTextColor(128, 0, 128); // Purple
      doc.text('Alcoholic People:', 20, yPosition);
      yPosition += 12;
      
      doc.setTextColor(0, 0, 0);
      const alcoholicNames = alcoholicPeopleList.map(person => person.name || 'Unnamed').join(', ');
      const lines = doc.splitTextToSize(alcoholicNames, 80); // Narrower width for side-by-side
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 10;
    }
    
    // Right column - Non-alcoholic people (reset yPosition to start at same level)
    let rightYPosition = startYPosition;
    if (nonAlcoholicPeopleList.length > 0) {
      doc.setTextColor(0, 150, 0); // Green
      doc.text('Non-Alcoholic People:', 110, rightYPosition);
      rightYPosition += 12;
      
      doc.setTextColor(0, 0, 0);
      const nonAlcoholicNames = nonAlcoholicPeopleList.map(person => person.name || 'Unnamed').join(', ');
      const lines = doc.splitTextToSize(nonAlcoholicNames, 80); // Narrower width for side-by-side
      doc.text(lines, 110, rightYPosition);
      rightYPosition += lines.length * 10;
    }
    
    // Set yPosition to the maximum of both columns
    yPosition = Math.max(yPosition, rightYPosition)
    
    // Add total line
    yPosition += 10;
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPosition, 190, yPosition);
    
    // Add grand total
    yPosition += 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green color
    doc.text(`GRAND TOTAL: Rs.${totalCost.toLocaleString()}`, 20, yPosition);
    
    // Add additional summary information
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('ADDITIONAL INFORMATION:', 20, yPosition);
    yPosition += 8;
    doc.text(`- Total number of items: ${items.length}`, 25, yPosition);
    yPosition += 10;
    doc.text(`- Alcoholic people cost per person: Rs.${alcoholicPeople > 0 ? alcoholicCostPerPerson.toLocaleString() : '0'}`, 25, yPosition);
    yPosition += 10;
    doc.text(`- Non-alcoholic people cost per person: Rs.${nonAlcoholicPeople > 0 ? nonAlcoholicCostPerPerson.toLocaleString() : '0'}`, 25, yPosition);

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Party Budget Planner - Page ${i} of ${pageCount}`, 140, 285);
      doc.text('For more party planning tools, visit our website', 140, 290);
    }

    // Save the PDF with a clean filename
    const cleanDate = currentDate.replace(/\//g, '-').replace(/\\/g, '-');
    doc.save(`Party-Budget-Report-${cleanDate}.pdf`);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className={`text-lg font-semibold text-center mb-4 ${
        darkMode ? 'text-white' : 'text-gray-700'
      }`}>
        📊 Export Your Budget Report
      </h3>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* PDF Generation Button */}
        <button
          onClick={generatePDFReport}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <span className="text-xl sm:text-2xl">📄</span>
          <span>Generate PDF</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm">↓</span>
          </div>
        </button>

        {/* JPG Generation Button */}
        <button
          onClick={generateJPGReport}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <span className="text-xl sm:text-2xl">🖼️</span>
          <span>Generate JPG</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm">↓</span>
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className={`text-sm max-w-md mx-auto ${
          darkMode ? 'text-gray-300' : 'text-gray-500'
        }`}>
          Choose your preferred format: PDF for documents or JPG for easy sharing on social media
        </p>
      </div>
    </div>
  );
};

export default PDFGenerator;