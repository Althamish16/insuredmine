import XLSX from 'xlsx';


export const convertXlsxToCsv = (xlsxFilePath) => {

    return new Promise((resolve, reject) => {

        try {

            const workbook = XLSX.readFile(xlsxFilePath);
            const sheetName = workbook.SheetNames[0]; // Assuming first sheet
            const csvFilePath = xlsxFilePath.replace('.xlsx', '.csv');

            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

            fs.writeFile(csvFilePath, csvData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(csvFilePath);
                }
            });

        } catch (error) {

            reject(error);

        }

    });
    
};