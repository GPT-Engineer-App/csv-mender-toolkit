import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Download, Upload } from 'lucide-react';

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
      },
      header: false,
    });
  };

  const handleCellEdit = (rowIndex, columnIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnIndex] = value;
    setCsvData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Editor</h1>
      
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <Button onClick={handleAddRow} className="mr-2">
          <Plus className="mr-2 h-4 w-4" /> Add Row
        </Button>
        <CSVLink data={[headers, ...csvData]} filename="edited_data.csv">
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CSVLink>
      </div>

      {csvData.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellEdit(rowIndex, columnIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Index;
