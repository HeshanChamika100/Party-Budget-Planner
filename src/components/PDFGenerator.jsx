import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFGenerator = ({ items, people, totalCost, perPerson }) => {

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
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">👥 Number of People</div>
              <div style="color: #333; font-size: 24px; font-weight: bold;">${people}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">💰 Total Cost</div>
              <div style="color: #059669; font-size: 24px; font-weight: bold;">Rs.${totalCost.toLocaleString()}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">👤 Cost per Person</div>
              <div style="color: #2563eb; font-size: 24px; font-weight: bold;">Rs.${parseFloat(perPerson).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #7c3aed; padding-left: 15px;">
          🛍️ PARTY ITEMS BREAKDOWN
        </h2>
        <div style="overflow: hidden; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 15px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 15px; font-weight: bold; font-size: 14px;">
            <div>Item Name</div>
            <div style="text-align: center;">Unit Price (Rs.)</div>
            <div style="text-align: center;">Quantity</div>
            <div style="text-align: center;">Total (Rs.)</div>
          </div>
          ${items.map((item, index) => {
            const itemTotal = item.unitPrice * item.quantity;
            const itemName = item.name || `Item ${index + 1}`;
            return `
              <div style="padding: 15px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 15px; border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <div style="font-weight: 500;">${itemName}</div>
                <div style="text-align: center;">${item.unitPrice.toLocaleString()}</div>
                <div style="text-align: center;">${item.quantity}</div>
                <div style="text-align: center; font-weight: bold; color: #059669;">${itemTotal.toLocaleString()}</div>
              </div>
            `;
          }).join('')}
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
            <div>• Average cost per item: Rs.${items.length > 0 ? (totalCost / items.length).toFixed(2) : '0'}</div>
            <div>• Budget per person: Rs.${parseFloat(perPerson).toLocaleString()}</div>
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

    // Summary section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BUDGET SUMMARY', 20, 65);

    doc.setFontSize(12);
    doc.text(`Number of People: ${people}`, 20, 80);
    doc.text(`Total Cost: Rs.${totalCost.toLocaleString()}`, 20, 90);
    doc.text(`Cost per Person: Rs.${parseFloat(perPerson).toLocaleString()}`, 20, 100);

    // Items section
    doc.setFontSize(16);
    doc.text('PARTY ITEMS BREAKDOWN', 20, 120);

    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(128, 0, 128);
    doc.text('Item Name', 20, 135);
    doc.text('Unit Price (Rs.)', 80, 135);
    doc.text('Quantity', 130, 135);
    doc.text('Total (Rs.)', 160, 135);

    // Add line under headers
    doc.setDrawColor(128, 0, 128);
    doc.line(20, 138, 190, 138);

    // Add items
    doc.setTextColor(0, 0, 0);
    let yPosition = 150;
    
    items.forEach((item, index) => {
      if (yPosition > 270) { // Check if we need a new page
        doc.addPage();
        // Add header on new page
        doc.setFontSize(16);
        doc.setTextColor(128, 0, 128);
        doc.text('PARTY ITEMS BREAKDOWN (Continued)', 20, 30);
        
        // Table headers on new page
        doc.setFontSize(10);
        doc.text('Item Name', 20, 45);
        doc.text('Unit Price (Rs.)', 80, 45);
        doc.text('Quantity', 130, 45);
        doc.text('Total (Rs.)', 160, 45);
        doc.line(20, 48, 190, 48);
        
        yPosition = 60;
        doc.setTextColor(0, 0, 0);
      }
      
      const itemTotal = item.unitPrice * item.quantity;
      const itemName = item.name || `Item ${index + 1}`;
      
      // Truncate long item names if necessary
      const truncatedName = itemName.length > 25 ? itemName.substring(0, 22) + '...' : itemName;
      
      doc.text(truncatedName, 20, yPosition);
      doc.text(item.unitPrice.toLocaleString(), 80, yPosition);
      doc.text(item.quantity.toString(), 130, yPosition);
      doc.text(itemTotal.toLocaleString(), 160, yPosition);
      yPosition += 12;
    });

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
    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('ADDITIONAL INFORMATION:', 20, yPosition);
    yPosition += 12;
    doc.text(`- Total number of items: ${items.length}`, 25, yPosition);
    yPosition += 10;
    doc.text(`- Average cost per item: Rs.${items.length > 0 ? (totalCost / items.length).toFixed(2) : '0'}`, 25, yPosition);
    yPosition += 10;
    doc.text(`- Budget per person: Rs.${parseFloat(perPerson).toLocaleString()}`, 25, yPosition);

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Party Budget Planner - Page ${i} of ${pageCount}`, 20, 285);
      doc.text('For more party planning tools, visit our website', 20, 290);
    }

    // Save the PDF with a clean filename
    const cleanDate = currentDate.replace(/\//g, '-').replace(/\\/g, '-');
    doc.save(`Party-Budget-Report-${cleanDate}.pdf`);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
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
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Choose your preferred format: PDF for documents or JPG for easy sharing on social media
        </p>
      </div>
    </div>
  );
};

export default PDFGenerator;