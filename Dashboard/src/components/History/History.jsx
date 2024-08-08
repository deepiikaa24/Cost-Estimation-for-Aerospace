import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // Use the correct import for XLSX
import { useTable } from 'react-table';
import './History.css';

const History = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Load and parse the Excel file
    const loadExcelFile = async () => {
      const filePath = require('./RM Details-SAP.xlsx'); // Path to your Excel file
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Assume the first sheet contains the data
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Set up columns and data
      const columns = Object.keys(jsonData[0]).map(key => ({
        Header: key,
        accessor: key
      }));

      setColumns(columns);
      setData(jsonData);
    };

    loadExcelFile();
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="history-container">
      <h1>History Information</h1>
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
