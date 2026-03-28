// Invoice Generator Component
import { useState } from 'react';
import { FileText, Download, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

type Order = {
  id: string;
  created_at: string;
  weight: number;
  formula: string;
  total_price: number;
  pickup_address: string;
  delivery_address?: string;
  status: string;
};

type Props = {
  order: Order;
  clientName: string;
  clientEmail: string;
};

export default function InvoiceGenerator({ order, clientName, clientEmail }: Props) {
  const [generating, setGenerating] = useState(false);

  const generateInvoice = () => {
    setGenerating(true);
    
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const pricePerKg = order.formula === 'express' ? 5 : order.formula === 'eco' ? 2.5 : 3;
    const subtotal = order.weight * pricePerKg;
    const tva = subtotal * 0.2; // 20% TVA
    const total = subtotal + tva;

    // Create printable HTML content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Facture ${invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #14b8a6; }
          .logo { font-size: 32px; font-weight: 800; color: #14b8a6; }
          .logo span { color: #06b6d4; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 24px; font-weight: 700; color: #1e293b; }
          .invoice-date { color: #64748b; margin-top: 5px; }
          .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .address-block { width: 45%; }
          .address-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
          .address-content { font-size: 14px; line-height: 1.6; }
          .company-name { font-weight: 700; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f1f5f9; padding: 15px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
          td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
          .item-desc { font-weight: 500; }
          .item-details { font-size: 12px; color: #64748b; margin-top: 4px; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .total-row.final { border-bottom: none; border-top: 2px solid #14b8a6; padding-top: 15px; margin-top: 5px; }
          .total-label { color: #64748b; }
          .total-value { font-weight: 600; }
          .total-row.final .total-label, .total-row.final .total-value { font-size: 18px; font-weight: 700; color: #1e293b; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status-completed { background: #dcfce7; color: #166534; }
          .status-pending { background: #fef3c7; color: #92400e; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Kilo<span>lab</span></div>
          <div class="invoice-info">
            <div class="invoice-number">${invoiceNumber}</div>
            <div class="invoice-date">${date}</div>
            <div style="margin-top: 10px;">
              <span class="status-badge ${order.status === 'completed' ? 'status-completed' : 'status-pending'}">
                ${order.status === 'completed' ? '✓ Payée' : 'En cours'}
              </span>
            </div>
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <div class="address-title">Émetteur</div>
            <div class="address-content">
              <div class="company-name">KILOLAB SAS</div>
              <div>123 Avenue de la Laverie</div>
              <div>75001 Paris, France</div>
              <div style="margin-top: 10px;">SIRET: 123 456 789 00012</div>
              <div>TVA: FR12 123456789</div>
            </div>
          </div>
          <div class="address-block">
            <div class="address-title">Client</div>
            <div class="address-content">
              <div class="company-name">${clientName}</div>
              <div>${clientEmail}</div>
              <div style="margin-top: 10px;">${order.pickup_address}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Quantité</th>
              <th class="text-right">Prix unit.</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-desc">Service de lavage - ${order.formula === 'express' ? 'Express ⚡' : order.formula === 'eco' ? 'Éco 🌿' : 'Standard'}</div>
                <div class="item-details">Collecte, lavage, repassage et livraison</div>
              </td>
              <td class="text-right">${order.weight} kg</td>
              <td class="text-right">${pricePerKg.toFixed(2)} €</td>
              <td class="text-right">${subtotal.toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span class="total-label">Sous-total HT</span>
            <span class="total-value">${(subtotal / 1.2).toFixed(2)} €</span>
          </div>
          <div class="total-row">
            <span class="total-label">TVA (20%)</span>
            <span class="total-value">${(subtotal - subtotal/1.2).toFixed(2)} €</span>
          </div>
          <div class="total-row final">
            <span class="total-label">Total TTC</span>
            <span class="total-value">${subtotal.toFixed(2)} €</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Kilolab</strong> - Le pressing à domicile</p>
          <p style="margin-top: 5px;">www.kilolab.fr | contact@kilolab.fr | 01 23 45 67 89</p>
          <p style="margin-top: 10px; font-size: 11px;">
            Conditions de paiement : Paiement à la commande | En cas de litige, contacter notre service client
          </p>
        </div>
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setGenerating(false);
          toast.success('Facture générée !');
        }, 250);
      };
    } else {
      setGenerating(false);
      toast.error('Impossible d\'ouvrir la fenêtre. Vérifiez votre bloqueur de popups.');
    }
  };

  return (
    <button
      onClick={generateInvoice}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition disabled:opacity-50"
    >
      {generating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <FileText size={18} />
      )}
      {generating ? 'Génération...' : 'Facture'}
    </button>
  );
}
