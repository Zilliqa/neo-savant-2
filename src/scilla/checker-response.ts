export type Response = {
  warnings?: CodeWarning[];
  errors?: CodeError[];
};

export type CodeWarning = {
  start_location: Location;
  end_location: Location;
  warning_id: number;
  warning_message: string;
};

export type Location = {
  column: number;
  file: string;
  line: number;
};

export type CodeError = {
  line: number;
  column: number;
  msg: string;
};
