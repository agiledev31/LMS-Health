import Modal from "./Modal";

export default function ConfirmModal({open=false, setOpen, content="Are you sure you answered this question correctly?", onConfirm=()=>{}, onCancel=()=>{}, withOutCancel=false}) {
    return (
      <Modal open={open} setOpen={setOpen}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="matiere"
            className="block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            {content}
          </label>
          <div className="mt-4 flex flex-row-reverse gap-2">
            <button
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >Yes
            </button>
            {!withOutCancel && <button
              onClick={() => {
                setOpen(false);
                onCancel();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md  px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {/* {deleting && <Spinner small />}  */}
              Cancel
            </button>}
          </div>
        </div>
      </Modal>
    );
  }