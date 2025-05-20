// ExcelUtils.js
import * as XLSX from 'xlsx';

/**
 * Generate and download Excel file from booking data
 * @param {Array} bookingsData - Array of booking objects
 * @param {String} fileName - Name of the Excel file (without extension)
 */
export const generateBookingsExcel = (bookingsData, fileName = 'bookings-data') => {
  try {
    // Format data for Excel
    const excelData = bookingsData.map(booking => ({
      'Booking ID': booking.bookingId,
      'User ID': booking.userId || 'N/A',
      'Car Make': booking.carMake || 'N/A',
      'Car Model': booking.carModel || 'N/A',
      'Pickup Location': booking.pickupLocation || 'N/A',
      'Destination': booking.destination || 'N/A',
      'Pickup Date': formatDate(booking.pickupDate),
      'Pickup Time': formatTime(booking.pickupTime),
      'Rider Mobile': booking.riderMobile || 'N/A',
      'Driver Name': booking.driverName || 'N/A',
      'Status': booking.status || 'N/A'
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 10 },  // Booking ID
      { wch: 10 },  // USER ID
      { wch: 15 },  // Car Make
      { wch: 15 },  // Car Model
      { wch: 30 },  // Pickup Location
      { wch: 30 },  // Destination
      { wch: 12 },  // Pickup Date
      { wch: 12 },  // Pickup Time 
      { wch: 15 },  // Rider Mobile
      { wch: 20 },  // Driver Name
      { wch: 12 },  // Status
    ];
    
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

    // Generate Excel file and trigger download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName}-${timestamp}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};

/**
 * Generate and download Excel file from driver data
 * @param {Array} driversData - Array of driver objects
 * @param {String} fileName - Name of the Excel file (without extension)
 */
export const generateDriversExcel = (driversData, fileName = 'drivers-data') => {
  try {
    // Format data for Excel
    const excelData = driversData.map(driver => ({
      'ID': driver.id,
      'Name': driver.name || 'N/A',
      'Mobile Number': driver.mobileNumber || 'N/A',
      'License Number': driver.licenseNumber || 'N/A',
      'Available': driver.available ? 'Yes' : 'No'
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // ID
      { wch: 20 },  // Name
      { wch: 15 },  // Mobile Number
      { wch: 15 },  // License Number
      { wch: 10 },  // Available
    ];
    
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Drivers');

    // Generate Excel file and trigger download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName}-${timestamp}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};

/**
 * Generate and download Excel file from car data
 * @param {Array} carsData - Array of car objects
 * @param {String} fileName - Name of the Excel file (without extension)
 */
export const generateCarsExcel = (carsData, fileName = 'cars-data') => {
  try {
    // Format the data for all cars in a single worksheet
    const allCarsData = [];
    
    carsData.forEach(car => {
      // For each car, check if it has maintenance history
      if (car.maintenanceHistory && car.maintenanceHistory.length > 0) {
        // For each maintenance record, create a row
        car.maintenanceHistory.forEach((maintenance, index) => {
          // Skip completely empty maintenance records
          if (!maintenance.date && !maintenance.description && !maintenance.vendor && 
              (!maintenance.partsUsed || maintenance.partsUsed.every(part => !part))) {
            return;
          }
          
          allCarsData.push({
            'Car ID': car.carId,
            'Make': car.make || 'N/A',
            'Model': car.model || 'N/A',
            'Status': car.status || 'N/A',
            'Created At': formatDateWithTime(car.createdAt),
            'Updated At': formatDateWithTime(car.updatedAt),
            'Insurance Provider': car.insurance?.provider || 'N/A',
            'Policy Number': car.insurance?.policyNumber || 'N/A',
            'Insurance Expiry': formatDate(car.insurance?.expiry),
            'Insurance Created At': formatDateWithTime(car.insurance?.createdAt),
            'Insurance Updated At': formatDateWithTime(car.insurance?.updatedAt),
            'Location Address': car.location?.address || 'N/A',
            'Latitude': car.location?.latitude || 'N/A',
            'Longitude': car.location?.longitude || 'N/A',
            'Location Created At': formatDateWithTime(car.location?.createdAt),
            'Location Updated At': formatDateWithTime(car.location?.updatedAt),
            'Maintenance Date': formatDate(maintenance.date),
            'Maintenance Description': maintenance.description || 'N/A',
            'Maintenance Cost': maintenance.cost !== null && maintenance.cost !== undefined ? maintenance.cost : 'N/A',
            'Maintenance Vendor': maintenance.vendor || 'N/A',
            'Labor Hours': maintenance.laborHours !== null && maintenance.laborHours !== undefined ? maintenance.laborHours : 'N/A',
            'Parts Used': Array.isArray(maintenance.partsUsed) ? maintenance.partsUsed.filter(part => part).join(', ') : 'N/A',
            'Maintenance Created At': formatDateWithTime(maintenance.createdAt),
            'Maintenance Updated At': formatDateWithTime(maintenance.updatedAt)
          });
        });
      } else {
        // If no maintenance history, still add the car
        allCarsData.push({
          'Car ID': car.carId,
          'Make': car.make || 'N/A',
          'Model': car.model || 'N/A',
          'Status': car.status || 'N/A',
          'Created At': formatDateWithTime(car.createdAt),
          'Updated At': formatDateWithTime(car.updatedAt),
          'Insurance Provider': car.insurance?.provider || 'N/A',
          'Policy Number': car.insurance?.policyNumber || 'N/A',
          'Insurance Expiry': formatDate(car.insurance?.expiry),
          'Insurance Created At': formatDateWithTime(car.insurance?.createdAt),
          'Insurance Updated At': formatDateWithTime(car.insurance?.updatedAt),
          'Location Address': car.location?.address || 'N/A',
          'Latitude': car.location?.latitude || 'N/A',
          'Longitude': car.location?.longitude || 'N/A',
          'Location Created At': formatDateWithTime(car.location?.createdAt),
          'Location Updated At': formatDateWithTime(car.location?.updatedAt),
          'Maintenance Date': 'N/A',
          'Maintenance Description': 'N/A',
          'Maintenance Cost': 'N/A',
          'Maintenance Vendor': 'N/A',
          'Labor Hours': 'N/A',
          'Parts Used': 'N/A',
          'Maintenance Created At': 'N/A',
          'Maintenance Updated At': 'N/A'
        });
      }
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(allCarsData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 8 },   // Car ID
      { wch: 15 },  // Make
      { wch: 15 },  // Model
      { wch: 12 },  // Status
      { wch: 20 },  // Created At (with time)
      { wch: 20 },  // Updated At (with time)
      { wch: 20 },  // Insurance Provider
      { wch: 15 },  // Policy Number
      { wch: 15 },  // Insurance Expiry
      { wch: 20 },  // Insurance Created At (with time)
      { wch: 20 },  // Insurance Updated At (with time)
      { wch: 30 },  // Location Address
      { wch: 10 },  // Latitude
      { wch: 10 },  // Longitude
      { wch: 20 },  // Location Created At (with time)
      { wch: 20 },  // Location Updated At (with time)
      { wch: 15 },  // Maintenance Date
      { wch: 30 },  // Maintenance Description
      { wch: 15 },  // Maintenance Cost
      { wch: 20 },  // Maintenance Vendor
      { wch: 12 },  // Labor Hours
      { wch: 30 },  // Parts Used
      { wch: 20 },  // Maintenance Created At (with time)
      { wch: 20 },  // Maintenance Updated At (with time)
    ];
    
    worksheet['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cars and Maintenance');

    // Generate Excel file and trigger download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFileName = `${fileName}-${timestamp}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};

/**
 * Format date string to readable format (date only)
 * @param {String} dateString - Date string in ISO format
 * @returns {String} - Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return dateString || 'N/A';
  }
};

/**
 * Format date string to readable format with time
 * @param {String} dateString - Date string in ISO format
 * @returns {String} - Formatted date and time string
 */
const formatDateWithTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  } catch (error) {
    return dateString || 'N/A';
  }
};

/**
 * Format time string to readable format
 * @param {String} timeString - Time string in HH:MM:SS format
 * @returns {String} - Formatted time string
 */
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';

  try {
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;

    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${hours}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString || 'N/A';
  }
};