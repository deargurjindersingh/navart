import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  MessageSquare, 
  Sparkles, 
  Eye, 
  Layers,
  Camera,
  RefreshCw,
  Send
} from 'lucide-react';
import { Order, ArtMedia, ArtRevision } from '../../types';

interface ArtistWorkspaceProps {
  orders: Order[];
  onUploadPreviewProof: (orderId: string, previewUrl: string, note?: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: any, note: string) => void;
}

export const ArtistWorkspace: React.FC<ArtistWorkspaceProps> = ({
  orders,
  onUploadPreviewProof,
  onUpdateOrderStatus,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  
  const [internalNote, setInternalNote] = useState('');
  const [previewUploadUrl, setPreviewUploadUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [customProofFile, setCustomProofFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Sample quick proofs for demo testing
  const SAMPLE_ARTIST_PROOFS = [
    {
      title: 'Graphite Pencil Proof (Detailed Shading)',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Oil Painting Impressionist Impasto',
      url: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Watercolor Wash (Luminous Pastel)',
      url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomProofFile(url);
      setPreviewUploadUrl(url);
    }
  };

  const handlePublishProof = () => {
    const urlToUse = customProofFile || previewUploadUrl || SAMPLE_ARTIST_PROOFS[0].url;
    if (!urlToUse) return;

    setIsUploading(true);
    setTimeout(() => {
      onUploadPreviewProof(selectedOrder.id, urlToUse, internalNote);
      setIsUploading(false);
      setInternalNote('');
      setCustomProofFile(null);
    }, 600);
  };

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fadeIn">
      
      {/* Workspace Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            Artist Studio Workspace
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Assigned Commissions & Proof Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as Master Artist Elena Rostova • 2 Commissions in active queue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Elena"
              className="w-10 h-10 rounded-full object-cover border border-slate-300"
            />
            <div>
              <div className="font-bold text-xs text-slate-900">Elena Rostova</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Available for Commissions</div>
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-sm">No commissions currently assigned to your queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* Left: Assigned Orders Queue */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Active Queue ({orders.length})
            </h3>

            {orders.map((order) => {
              const isSelected = order.id === selectedOrder?.id;
              const hasRevision = order.status === 'revision_requested';
              return (
                <div
                  key={order.id}
                  id={`artist-order-card-${order.id}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-400 shadow-md'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {order.config.sourcePhotos && order.config.sourcePhotos[0] ? (
                      <img
                        src={order.config.sourcePhotos[0].url}
                        alt="Source"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Palette className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{order.orderNumber}</span>
                        {hasRevision && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                            Revision Needed
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-serif text-slate-600 truncate max-w-[140px]">
                        {order.config.styleName} ({order.config.size})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Due by: {order.assignment?.dueAt ? new Date(order.assignment.dueAt).toLocaleDateString() : 'In 3 days'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Active Commission Studio & Proof Uploader */}
          {selectedOrder && (
            <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-6">
              
              {/* Order Info & Client Requirements Banner */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commission Blueprint</span>
                    <h2 className="font-serif text-2xl font-bold text-slate-900">
                      {selectedOrder.orderNumber} • {selectedOrder.config.styleName}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
                    {selectedOrder.pricing.faceCount} Person(s) / Subject(s)
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Size</span>
                    <strong className="text-slate-800">{selectedOrder.pricing.sizeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Paper / Surface</span>
                    <strong className="text-slate-800">{selectedOrder.pricing.materialName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Frame Choice</span>
                    <strong className="text-slate-800">{selectedOrder.pricing.frameName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Background</span>
                    <strong className="text-slate-800">{selectedOrder.pricing.backgroundName}</strong>
                  </div>
                </div>

                {/* Client Special Notes */}
                {selectedOrder.config.customerNotes && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800">
                    <strong className="text-slate-900 flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-700" />
                      <span>Client Instructions:</span>
                    </strong>
                    <p className="italic leading-relaxed">{selectedOrder.config.customerNotes}</p>
                  </div>
                )}

                {/* Customer Uploaded High-Res Source Images for Download */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Customer Source Images (Secure Access):
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {selectedOrder.config.sourcePhotos.map((photo) => (
                      <div key={photo.id} className="relative group bg-slate-900 rounded-2xl overflow-hidden p-1 border border-slate-300">
                        <img
                          src={photo.url}
                          alt="Customer Source"
                          className="w-36 h-36 object-cover rounded-xl"
                        />
                        <a
                          href={photo.url}
                          target="_blank"
                          rel="noreferrer"
                          download={photo.fileName}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1"
                        >
                          <Download className="w-5 h-5 text-blue-400" />
                          <span>Download Raw</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Revision Notice Alert */}
              {selectedOrder.status === 'revision_requested' && selectedOrder.revisions.length > 0 && (
                <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <RefreshCw className="w-4 h-4 text-rose-700" />
                    <span>Client Requested Revision #{selectedOrder.revisions[selectedOrder.revisions.length - 1].versionNo}:</span>
                  </div>
                  <p className="text-xs text-rose-800 italic bg-white p-3 rounded-xl border border-rose-200">
                    "{selectedOrder.revisions[selectedOrder.revisions.length - 1].feedback}"
                  </p>
                </div>
              )}

              {/* Upload Proof Studio Module */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-400 shadow-xs space-y-5">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-xl flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span>Upload Watermarked Proof (v{(selectedOrder.activePreviewVersion || 0) + 1})</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your high-res progress sketch/painting. The system will watermark it and notify the client for 1-click approval.
                    </p>
                  </div>
                </div>

                {/* Upload File Input */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      if (file.type.startsWith('image/')) {
                        const url = URL.createObjectURL(file);
                        setCustomProofFile(url);
                        setPreviewUploadUrl(url);
                      } else {
                        alert('Please drop a valid image file.');
                      }
                    }
                  }}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/60 p-6 rounded-2xl text-center cursor-pointer transition-all hover:shadow-md"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-xs text-slate-900">
                    {customProofFile ? 'Custom artwork uploaded successfully! Click or drop to replace' : 'Click or Drag & Drop Artwork Scan / Photo'}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">High-resolution scan (JPEG, PNG, WEBP)</p>
                </div>

                {/* Or select from quick studio sample renders */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                    Or select completed proof draft:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_ARTIST_PROOFS.map((proof, idx) => (
                      <button
                        key={idx}
                        id={`artist-proof-sample-${idx}`}
                        onClick={() => {
                          setPreviewUploadUrl(proof.url);
                          setCustomProofFile(null);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all text-xs flex items-center gap-2 ${
                          previewUploadUrl === proof.url && !customProofFile
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400 font-bold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <img src={proof.url} alt="Proof" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-[11px] truncate">{proof.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal / Customer Note */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Artist Note for Proof (Visible to Client):
                  </label>
                  <textarea
                    rows={2}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Elena: Finished the fine graphite tonal shading on the expressions. Let me know if you would like any highlights adjusted!"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Publish Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Watermark automatically applied before customer delivery
                  </div>

                  <button
                    id="btn-publish-artist-proof"
                    onClick={handlePublishProof}
                    disabled={isUploading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-sky-200" />
                        <span>Publishing Watermarked Proof...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Proof for Client Approval</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
