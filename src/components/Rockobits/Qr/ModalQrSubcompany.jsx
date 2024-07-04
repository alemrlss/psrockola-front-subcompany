/* eslint-disable react/prop-types */
import { QRCodeCanvas } from "qrcode.react";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Button, Modal } from "@mui/material";

function ModalQrSubcompany({
  isModalOpen,
  handleCloseModal,
  selectedQr,
  handleDownloadQR,
  handleToggleQr,
  formatExpirationDate,
}) {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-5 mx-4 sm:max-w-lg sm:p-6 relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-0 right-0 p-1 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-center">
            <div id="canvas" className="border p-2 relative">
              <QRCodeCanvas
                value={selectedQr.token}
                size={300}
                bgColor={"#ffffff"}
                fgColor={"#000"}
                level={"H"}
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 80,
                  width: 80,
                  excavate: false,
                }}
              />
            </div>
          </div>
          <div className="p-1">
            <p className="text-center">
              <b>{selectedQr.amount} Rockobits</b>
            </p>
            <p className="text-center">
              Expired {formatExpirationDate(selectedQr.expiration)}
            </p>
            <div className="flex justify-center space-x-5 mt-2">
              {selectedQr.state === 1 && (
                <Button
                  sx={{
                    backgroundColor: "#D20103",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#B30000",
                    },
                  }}
                  onClick={() => {
                    handleToggleQr(0);
                  }}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                >
                  Deactivate
                </Button>
              )}

              <Button
                onClick={()=>{
                  handleDownloadQR(selectedQr);
                }}
                variant="contained"
                color="success"
                startIcon={<CloudDownloadIcon />}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalQrSubcompany;
