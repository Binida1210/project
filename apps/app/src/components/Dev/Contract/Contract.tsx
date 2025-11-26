import { useEffect, useState } from 'react';

import { CreateContract, useContract } from '@/hooks';

// Small contract dev view used for testing PDF generation & viewer.
// The `useContract` hook exposes helpers to create and display contract PDFs.
export function Contract() {
  const { viewContract, createContract, testOptions } = useContract();
  const [contract, setContract] = useState<CreateContract>();
  const [pdfContent, setPdfContent] = useState<string>();

  // When we obtain base64 PDF content, instruct the embedded viewer to load it.
  useEffect(() => {
    if (pdfContent) viewContract({ containerId: 'contract', base64: pdfContent });
  }, [pdfContent]);

  return (
    <>
      <button onClick={() => setContract(createContract({ pdfOptions: testOptions }))}>create contract</button>
      <button onClick={contract?.open}>open contract</button>
      <button onClick={() => contract?.getBase64((base64) => setPdfContent(base64))}>display base64 pdf</button>
      <div id="contract" style={{ height: '100%' }}></div>;
    </>
  );
}
