import {Button} from "@mui/material";
import React from "react";

const Edit = (close, setClose) => {
  console.log(close);
  return (
    <div className="absolute w-full top-[30%] h-full">
      <div className="h-full">
        <div className="bg-white/50 flex flex-col   justify-center gap-4 rounded-3xl shadow-2xl p-8 backdrop-blur m-5 w-[50%] mx-auto">
          <input
            value={name}
            //   onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl p-3 bg-black/60 text-white w-full "
            placeholder="الاسم"
          />
          <div className="w-[50%] flex justify-between gap-4 mx-auto my-5">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {}}
            >
              تعديل
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => {
                setClose(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
