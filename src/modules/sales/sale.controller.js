import { getAll, getById, createNew } from "./sale.service.js";
import { asyncHandler } from '../../core/middlewares/asyncHandler.js'
import { SalesReportExporter } from '../../reports/bridge/SalesReportExporter.js';
import { makeRenderer } from '../../reports/rendererFactory.js';

export const getAllSales = asyncHandler(async (req, res) => {
    const page = toIntOrUndefined(req.query.page);
    const pageSize = toPageSize(req.query.pageSize);

    const payment_id = (req.query.payment_id ?? '').toString();
    const kind_id = (req.query.kind_id ?? '').toString();
    const state_id = (req.query.state_id ?? '').toString();
    const day = (req.query.day ?? '').toString();
    const dateFrom = (req.query.dateFrom ?? '').toString();
    const dateTo = (req.query.dateTo ?? '').toString();

    const result = await getAll({ page, pageSize, payment_id, kind_id, state_id, day, dateFrom, dateTo, });
    return res.status(200).json(result);
});

export const getSaleById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await getById(id);
    return res.status(200).json(result);
});

export const createSale = asyncHandler(async (req, res) => {
    const result = await createNew(req.body);
    return res.status(201).json(result);
});

export const getSalesReport = asyncHandler(async (req, res) => {
    const { payment_id, kind_id, state_id, day, dateFrom, dateTo, format } = req.query;

    const result = await getAll({
        page: undefined,
        pageSize: 'all',
        payment_id, kind_id, state_id, day, dateFrom, dateTo,
    });

    const renderer = makeRenderer((format ?? 'pdf').toString());
    const exporter = new SalesReportExporter(renderer);
    const filters = { payment_id, kind_id, state_id, day, dateFrom, dateTo };

    const { buffer, contentType, filename } = await exporter.export({
        items: result.items,
        filters,
    });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.send(buffer);
});

/*export const getSalesReportExcel = asyncHandler(async (req, res) => {
    const { payment_id, kind_id, state_id, day, dateFrom, dateTo } = req.query;

    const result = await getAll({
        page: undefined,
        pageSize: 'all',
        payment_id, kind_id, state_id, day, dateFrom, dateTo,
    });

    const xlsxBuffer = await makeSalesReportXlsx({
        items: result.items,
        filters: { payment_id, kind_id, state_id, day, dateFrom, dateTo },
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ventas.xlsx"');

    return res.send(xlsxBuffer);
});*/


const toIntOrUndefined = (v) => {
  const n = Number(v);
  return Number.isInteger(n) ? n : undefined;
};

const toPageSize = (v) => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'string' && v.toLowerCase() === 'all') return 'all';
  const n = Number(v);
  return Number.isInteger(n) ? n : undefined;
};