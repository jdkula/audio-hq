import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: number;
  float8: number;
  jsonb: any;
  numeric: number;
  timestamptz: Date;
  uuid: string;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

export type Claim_Delete_Job_Args = {
  worker_id?: InputMaybe<Scalars['uuid']>;
};

export type Claim_Job_Args = {
  worker_id?: InputMaybe<Scalars['uuid']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "delete_job" */
export type Delete_Job = {
  __typename?: 'delete_job';
  assigned_worker?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  file: File;
  file_id: Scalars['uuid'];
  id: Scalars['uuid'];
};

/** order by aggregate values of table "delete_job" */
export type Delete_Job_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Delete_Job_Max_Order_By>;
  min?: InputMaybe<Delete_Job_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "delete_job". All fields are combined with a logical 'AND'. */
export type Delete_Job_Bool_Exp = {
  _and?: InputMaybe<Array<Delete_Job_Bool_Exp>>;
  _not?: InputMaybe<Delete_Job_Bool_Exp>;
  _or?: InputMaybe<Array<Delete_Job_Bool_Exp>>;
  assigned_worker?: InputMaybe<Uuid_Comparison_Exp>;
  file?: InputMaybe<File_Bool_Exp>;
  file_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** order by max() on columns of table "delete_job" */
export type Delete_Job_Max_Order_By = {
  assigned_worker?: InputMaybe<Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "delete_job" */
export type Delete_Job_Min_Order_By = {
  assigned_worker?: InputMaybe<Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "delete_job" */
export type Delete_Job_Mutation_Response = {
  __typename?: 'delete_job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Delete_Job>;
};

/** Ordering options when selecting data from "delete_job". */
export type Delete_Job_Order_By = {
  assigned_worker?: InputMaybe<Order_By>;
  file?: InputMaybe<File_Order_By>;
  file_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: delete_job */
export type Delete_Job_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "delete_job" */
export enum Delete_Job_Select_Column {
  /** column name */
  AssignedWorker = 'assigned_worker',
  /** column name */
  FileId = 'file_id',
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "delete_job" */
export type Delete_Job_Set_Input = {
  assigned_worker?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "delete_job" */
export type Delete_Job_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Delete_Job_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Delete_Job_Stream_Cursor_Value_Input = {
  assigned_worker?: InputMaybe<Scalars['uuid']>;
  file_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
};

export type Delete_Job_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Delete_Job_Set_Input>;
  where: Delete_Job_Bool_Exp;
};

/** columns and relationships of "file" */
export type File = {
  __typename?: 'file';
  description: Scalars['String'];
  download_url: Scalars['String'];
  id: Scalars['uuid'];
  length: Scalars['numeric'];
  name: Scalars['String'];
  ordering?: Maybe<Scalars['bigint']>;
  path: Scalars['jsonb'];
  provider_id?: Maybe<Scalars['String']>;
  type: File_Type_Enum_Enum;
  workspace_id: Scalars['uuid'];
};


/** columns and relationships of "file" */
export type FilePathArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to filter rows from the table "file". All fields are combined with a logical 'AND'. */
export type File_Bool_Exp = {
  _and?: InputMaybe<Array<File_Bool_Exp>>;
  _not?: InputMaybe<File_Bool_Exp>;
  _or?: InputMaybe<Array<File_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  download_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  length?: InputMaybe<Numeric_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  ordering?: InputMaybe<Bigint_Comparison_Exp>;
  path?: InputMaybe<Jsonb_Comparison_Exp>;
  provider_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<File_Type_Enum_Enum_Comparison_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "file" */
export enum File_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "file" */
export type File_Insert_Input = {
  description?: InputMaybe<Scalars['String']>;
  download_url?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['numeric']>;
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
  provider_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<File_Type_Enum_Enum>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** response of any mutation on the table "file" */
export type File_Mutation_Response = {
  __typename?: 'file_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<File>;
};

/** on_conflict condition type for table "file" */
export type File_On_Conflict = {
  constraint: File_Constraint;
  update_columns?: Array<File_Update_Column>;
  where?: InputMaybe<File_Bool_Exp>;
};

/** Ordering options when selecting data from "file". */
export type File_Order_By = {
  description?: InputMaybe<Order_By>;
  download_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** select columns of table "file" */
export enum File_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  DownloadUrl = 'download_url',
  /** column name */
  Id = 'id',
  /** column name */
  Length = 'length',
  /** column name */
  Name = 'name',
  /** column name */
  Ordering = 'ordering',
  /** column name */
  Path = 'path',
  /** column name */
  ProviderId = 'provider_id',
  /** column name */
  Type = 'type',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** Streaming cursor of the table "file" */
export type File_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: File_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type File_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']>;
  download_url?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  length?: InputMaybe<Scalars['numeric']>;
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
  provider_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<File_Type_Enum_Enum>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

export enum File_Type_Enum_Enum {
  /** a single audio file */
  Audio = 'audio',
  /** a set of audio files */
  Audioset = 'audioset'
}

/** Boolean expression to compare columns of type "file_type_enum_enum". All fields are combined with logical 'AND'. */
export type File_Type_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<File_Type_Enum_Enum>;
  _in?: InputMaybe<Array<File_Type_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<File_Type_Enum_Enum>;
  _nin?: InputMaybe<Array<File_Type_Enum_Enum>>;
};

/** placeholder for update columns of table "file" (current role has no relevant permissions) */
export enum File_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

/** columns and relationships of "file_upload" */
export type File_Upload = {
  __typename?: 'file_upload';
  base64: Scalars['String'];
  id: Scalars['uuid'];
};

/** Boolean expression to filter rows from the table "file_upload". All fields are combined with a logical 'AND'. */
export type File_Upload_Bool_Exp = {
  _and?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  _not?: InputMaybe<File_Upload_Bool_Exp>;
  _or?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  base64?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** response of any mutation on the table "file_upload" */
export type File_Upload_Mutation_Response = {
  __typename?: 'file_upload_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<File_Upload>;
};

/** Ordering options when selecting data from "file_upload". */
export type File_Upload_Order_By = {
  base64?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "file_upload" */
export enum File_Upload_Select_Column {
  /** column name */
  Base64 = 'base64',
  /** column name */
  Id = 'id'
}

/** Streaming cursor of the table "file_upload" */
export type File_Upload_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: File_Upload_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type File_Upload_Stream_Cursor_Value_Input = {
  base64?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']>;
  _gt?: InputMaybe<Scalars['float8']>;
  _gte?: InputMaybe<Scalars['float8']>;
  _in?: InputMaybe<Array<Scalars['float8']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['float8']>;
  _lte?: InputMaybe<Scalars['float8']>;
  _neq?: InputMaybe<Scalars['float8']>;
  _nin?: InputMaybe<Array<Scalars['float8']>>;
};

/** columns and relationships of "job" */
export type Job = {
  __typename?: 'job';
  assign_time?: Maybe<Scalars['timestamptz']>;
  assigned_worker?: Maybe<Scalars['uuid']>;
  created_at: Scalars['timestamptz'];
  description: Scalars['String'];
  /** An object relationship */
  file_upload?: Maybe<File_Upload>;
  file_upload_id?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  name: Scalars['String'];
  option_cut_end?: Maybe<Scalars['float8']>;
  option_cut_start?: Maybe<Scalars['float8']>;
  option_fade_in?: Maybe<Scalars['float8']>;
  option_fade_out?: Maybe<Scalars['float8']>;
  path: Scalars['jsonb'];
  progress?: Maybe<Scalars['numeric']>;
  status: Job_Status_Enum_Enum;
  url?: Maybe<Scalars['String']>;
  workspace_id: Scalars['uuid'];
};


/** columns and relationships of "job" */
export type JobPathArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "job" */
export type Job_Aggregate_Order_By = {
  avg?: InputMaybe<Job_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Job_Max_Order_By>;
  min?: InputMaybe<Job_Min_Order_By>;
  stddev?: InputMaybe<Job_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Job_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Job_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Job_Sum_Order_By>;
  var_pop?: InputMaybe<Job_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Job_Var_Samp_Order_By>;
  variance?: InputMaybe<Job_Variance_Order_By>;
};

/** order by avg() on columns of table "job" */
export type Job_Avg_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "job". All fields are combined with a logical 'AND'. */
export type Job_Bool_Exp = {
  _and?: InputMaybe<Array<Job_Bool_Exp>>;
  _not?: InputMaybe<Job_Bool_Exp>;
  _or?: InputMaybe<Array<Job_Bool_Exp>>;
  assign_time?: InputMaybe<Timestamptz_Comparison_Exp>;
  assigned_worker?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  file_upload?: InputMaybe<File_Upload_Bool_Exp>;
  file_upload_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  option_cut_end?: InputMaybe<Float8_Comparison_Exp>;
  option_cut_start?: InputMaybe<Float8_Comparison_Exp>;
  option_fade_in?: InputMaybe<Float8_Comparison_Exp>;
  option_fade_out?: InputMaybe<Float8_Comparison_Exp>;
  path?: InputMaybe<Jsonb_Comparison_Exp>;
  progress?: InputMaybe<Numeric_Comparison_Exp>;
  status?: InputMaybe<Job_Status_Enum_Enum_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "job" */
export type Job_Inc_Input = {
  progress?: InputMaybe<Scalars['numeric']>;
};

/** order by max() on columns of table "job" */
export type Job_Max_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "job" */
export type Job_Min_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "job" */
export type Job_Mutation_Response = {
  __typename?: 'job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Job>;
};

/** Ordering options when selecting data from "job". */
export type Job_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  file_upload?: InputMaybe<File_Upload_Order_By>;
  file_upload_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: job */
export type Job_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "job" */
export enum Job_Select_Column {
  /** column name */
  AssignTime = 'assign_time',
  /** column name */
  AssignedWorker = 'assigned_worker',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  FileUploadId = 'file_upload_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OptionCutEnd = 'option_cut_end',
  /** column name */
  OptionCutStart = 'option_cut_start',
  /** column name */
  OptionFadeIn = 'option_fade_in',
  /** column name */
  OptionFadeOut = 'option_fade_out',
  /** column name */
  Path = 'path',
  /** column name */
  Progress = 'progress',
  /** column name */
  Status = 'status',
  /** column name */
  Url = 'url',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "job" */
export type Job_Set_Input = {
  assign_time?: InputMaybe<Scalars['timestamptz']>;
  assigned_worker?: InputMaybe<Scalars['uuid']>;
  error?: InputMaybe<Scalars['String']>;
  progress?: InputMaybe<Scalars['numeric']>;
  status?: InputMaybe<Job_Status_Enum_Enum>;
};

export enum Job_Status_Enum_Enum {
  /** assigned to a worker */
  Assigned = 'assigned',
  /** worker is converting the file */
  Converting = 'converting',
  /** job is done */
  Done = 'done',
  /** worker is downloading the necessary file */
  Downloading = 'downloading',
  /** an error occurred */
  Error = 'error',
  /** worker is saving the file to its final location */
  Saving = 'saving',
  /** file is being uploaded from the client to the worker */
  Uploading = 'uploading',
  /** waiting for a worker */
  Waiting = 'waiting'
}

/** Boolean expression to compare columns of type "job_status_enum_enum". All fields are combined with logical 'AND'. */
export type Job_Status_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Job_Status_Enum_Enum>;
  _in?: InputMaybe<Array<Job_Status_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Job_Status_Enum_Enum>;
  _nin?: InputMaybe<Array<Job_Status_Enum_Enum>>;
};

/** order by stddev() on columns of table "job" */
export type Job_Stddev_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "job" */
export type Job_Stddev_Pop_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "job" */
export type Job_Stddev_Samp_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "job" */
export type Job_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Job_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Job_Stream_Cursor_Value_Input = {
  assign_time?: InputMaybe<Scalars['timestamptz']>;
  assigned_worker?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  file_upload_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  option_cut_end?: InputMaybe<Scalars['float8']>;
  option_cut_start?: InputMaybe<Scalars['float8']>;
  option_fade_in?: InputMaybe<Scalars['float8']>;
  option_fade_out?: InputMaybe<Scalars['float8']>;
  path?: InputMaybe<Scalars['jsonb']>;
  progress?: InputMaybe<Scalars['numeric']>;
  status?: InputMaybe<Job_Status_Enum_Enum>;
  url?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by sum() on columns of table "job" */
export type Job_Sum_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

export type Job_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Job_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Job_Set_Input>;
  where: Job_Bool_Exp;
};

/** order by var_pop() on columns of table "job" */
export type Job_Var_Pop_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "job" */
export type Job_Var_Samp_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "job" */
export type Job_Variance_Order_By = {
  option_cut_end?: InputMaybe<Order_By>;
  option_cut_start?: InputMaybe<Order_By>;
  option_fade_in?: InputMaybe<Order_By>;
  option_fade_out?: InputMaybe<Order_By>;
  progress?: InputMaybe<Order_By>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** execute VOLATILE function "claim_delete_job" which returns "delete_job" */
  claim_delete_job?: Maybe<Delete_Job>;
  /** execute VOLATILE function "claim_job" which returns "job" */
  claim_job?: Maybe<Job>;
  /** delete data from the table: "delete_job" */
  delete_delete_job?: Maybe<Delete_Job_Mutation_Response>;
  /** delete single row from the table: "delete_job" */
  delete_delete_job_by_pk?: Maybe<Delete_Job>;
  /** delete data from the table: "file" */
  delete_file?: Maybe<File_Mutation_Response>;
  /** delete single row from the table: "file" */
  delete_file_by_pk?: Maybe<File>;
  /** delete data from the table: "file_upload" */
  delete_file_upload?: Maybe<File_Upload_Mutation_Response>;
  /** delete single row from the table: "file_upload" */
  delete_file_upload_by_pk?: Maybe<File_Upload>;
  /** delete data from the table: "job" */
  delete_job?: Maybe<Job_Mutation_Response>;
  /** delete single row from the table: "job" */
  delete_job_by_pk?: Maybe<Job>;
  /** delete data from the table: "workers" */
  delete_workers?: Maybe<Workers_Mutation_Response>;
  /** delete single row from the table: "workers" */
  delete_workers_by_pk?: Maybe<Workers>;
  /** insert data into the table: "file" */
  insert_file?: Maybe<File_Mutation_Response>;
  /** insert a single row into the table: "file" */
  insert_file_one?: Maybe<File>;
  /** insert data into the table: "workers" */
  insert_workers?: Maybe<Workers_Mutation_Response>;
  /** insert a single row into the table: "workers" */
  insert_workers_one?: Maybe<Workers>;
  /** update data of the table: "delete_job" */
  update_delete_job?: Maybe<Delete_Job_Mutation_Response>;
  /** update single row of the table: "delete_job" */
  update_delete_job_by_pk?: Maybe<Delete_Job>;
  /** update multiples rows of table: "delete_job" */
  update_delete_job_many?: Maybe<Array<Maybe<Delete_Job_Mutation_Response>>>;
  /** update data of the table: "job" */
  update_job?: Maybe<Job_Mutation_Response>;
  /** update single row of the table: "job" */
  update_job_by_pk?: Maybe<Job>;
  /** update multiples rows of table: "job" */
  update_job_many?: Maybe<Array<Maybe<Job_Mutation_Response>>>;
  /** update data of the table: "workers" */
  update_workers?: Maybe<Workers_Mutation_Response>;
  /** update single row of the table: "workers" */
  update_workers_by_pk?: Maybe<Workers>;
  /** update multiples rows of table: "workers" */
  update_workers_many?: Maybe<Array<Maybe<Workers_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootClaim_Delete_JobArgs = {
  args: Claim_Delete_Job_Args;
  distinct_on?: InputMaybe<Array<Delete_Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Delete_Job_Order_By>>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};


/** mutation root */
export type Mutation_RootClaim_JobArgs = {
  args: Claim_Job_Args;
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


/** mutation root */
export type Mutation_RootDelete_Delete_JobArgs = {
  where: Delete_Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Delete_Job_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_FileArgs = {
  where: File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_File_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_File_UploadArgs = {
  where: File_Upload_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_File_Upload_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_JobArgs = {
  where: Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Job_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_WorkersArgs = {
  where: Workers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Workers_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_FileArgs = {
  objects: Array<File_Insert_Input>;
  on_conflict?: InputMaybe<File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_File_OneArgs = {
  object: File_Insert_Input;
  on_conflict?: InputMaybe<File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WorkersArgs = {
  objects: Array<Workers_Insert_Input>;
  on_conflict?: InputMaybe<Workers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Workers_OneArgs = {
  object: Workers_Insert_Input;
  on_conflict?: InputMaybe<Workers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Delete_JobArgs = {
  _set?: InputMaybe<Delete_Job_Set_Input>;
  where: Delete_Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Delete_Job_By_PkArgs = {
  _set?: InputMaybe<Delete_Job_Set_Input>;
  pk_columns: Delete_Job_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Delete_Job_ManyArgs = {
  updates: Array<Delete_Job_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_JobArgs = {
  _inc?: InputMaybe<Job_Inc_Input>;
  _set?: InputMaybe<Job_Set_Input>;
  where: Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Job_By_PkArgs = {
  _inc?: InputMaybe<Job_Inc_Input>;
  _set?: InputMaybe<Job_Set_Input>;
  pk_columns: Job_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Job_ManyArgs = {
  updates: Array<Job_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_WorkersArgs = {
  _set?: InputMaybe<Workers_Set_Input>;
  where: Workers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Workers_By_PkArgs = {
  _set?: InputMaybe<Workers_Set_Input>;
  pk_columns: Workers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Workers_ManyArgs = {
  updates: Array<Workers_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** execute function "available_jobs" which returns "job" */
  available_jobs: Array<Job>;
  /** fetch data from the table: "delete_job" */
  delete_job: Array<Delete_Job>;
  /** fetch data from the table: "delete_job" using primary key columns */
  delete_job_by_pk?: Maybe<Delete_Job>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table: "workers" */
  workers: Array<Workers>;
  /** fetch data from the table: "workers" using primary key columns */
  workers_by_pk?: Maybe<Workers>;
};


export type Query_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootDelete_JobArgs = {
  distinct_on?: InputMaybe<Array<Delete_Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Delete_Job_Order_By>>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};


export type Query_RootDelete_Job_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Query_RootFile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFile_UploadArgs = {
  distinct_on?: InputMaybe<Array<File_Upload_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Upload_Order_By>>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};


export type Query_RootFile_Upload_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootJob_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWorkersArgs = {
  distinct_on?: InputMaybe<Array<Workers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workers_Order_By>>;
  where?: InputMaybe<Workers_Bool_Exp>;
};


export type Query_RootWorkers_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** execute function "available_jobs" which returns "job" */
  available_jobs: Array<Job>;
  /** fetch data from the table: "delete_job" */
  delete_job: Array<Delete_Job>;
  /** fetch data from the table: "delete_job" using primary key columns */
  delete_job_by_pk?: Maybe<Delete_Job>;
  /** fetch data from the table in a streaming manner : "delete_job" */
  delete_job_stream: Array<Delete_Job>;
  /** fetch data from the table: "file" */
  file: Array<File>;
  /** fetch data from the table: "file" using primary key columns */
  file_by_pk?: Maybe<File>;
  /** fetch data from the table in a streaming manner : "file" */
  file_stream: Array<File>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table in a streaming manner : "file_upload" */
  file_upload_stream: Array<File_Upload>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table in a streaming manner : "job" */
  job_stream: Array<Job>;
  /** fetch data from the table: "workers" */
  workers: Array<Workers>;
  /** fetch data from the table: "workers" using primary key columns */
  workers_by_pk?: Maybe<Workers>;
  /** fetch data from the table in a streaming manner : "workers" */
  workers_stream: Array<Workers>;
};


export type Subscription_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootDelete_JobArgs = {
  distinct_on?: InputMaybe<Array<Delete_Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Delete_Job_Order_By>>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};


export type Subscription_RootDelete_Job_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDelete_Job_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Delete_Job_Stream_Cursor_Input>>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};


export type Subscription_RootFileArgs = {
  distinct_on?: InputMaybe<Array<File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Order_By>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFile_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<File_Stream_Cursor_Input>>;
  where?: InputMaybe<File_Bool_Exp>;
};


export type Subscription_RootFile_UploadArgs = {
  distinct_on?: InputMaybe<Array<File_Upload_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<File_Upload_Order_By>>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};


export type Subscription_RootFile_Upload_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFile_Upload_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<File_Upload_Stream_Cursor_Input>>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};


export type Subscription_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootJob_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootJob_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Job_Stream_Cursor_Input>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootWorkersArgs = {
  distinct_on?: InputMaybe<Array<Workers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workers_Order_By>>;
  where?: InputMaybe<Workers_Bool_Exp>;
};


export type Subscription_RootWorkers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWorkers_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Workers_Stream_Cursor_Input>>;
  where?: InputMaybe<Workers_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

/** columns and relationships of "workers" */
export type Workers = {
  __typename?: 'workers';
  /** An array relationship */
  delete_jobs: Array<Delete_Job>;
  id: Scalars['uuid'];
  /** An array relationship */
  jobs: Array<Job>;
  last_check_in: Scalars['timestamptz'];
};


/** columns and relationships of "workers" */
export type WorkersDelete_JobsArgs = {
  distinct_on?: InputMaybe<Array<Delete_Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Delete_Job_Order_By>>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};


/** columns and relationships of "workers" */
export type WorkersJobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "workers". All fields are combined with a logical 'AND'. */
export type Workers_Bool_Exp = {
  _and?: InputMaybe<Array<Workers_Bool_Exp>>;
  _not?: InputMaybe<Workers_Bool_Exp>;
  _or?: InputMaybe<Array<Workers_Bool_Exp>>;
  delete_jobs?: InputMaybe<Delete_Job_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  jobs?: InputMaybe<Job_Bool_Exp>;
  last_check_in?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "workers" */
export enum Workers_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorkersPkey = 'workers_pkey'
}

/** input type for inserting data into table "workers" */
export type Workers_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  last_check_in?: InputMaybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "workers" */
export type Workers_Mutation_Response = {
  __typename?: 'workers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Workers>;
};

/** on_conflict condition type for table "workers" */
export type Workers_On_Conflict = {
  constraint: Workers_Constraint;
  update_columns?: Array<Workers_Update_Column>;
  where?: InputMaybe<Workers_Bool_Exp>;
};

/** Ordering options when selecting data from "workers". */
export type Workers_Order_By = {
  delete_jobs_aggregate?: InputMaybe<Delete_Job_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  jobs_aggregate?: InputMaybe<Job_Aggregate_Order_By>;
  last_check_in?: InputMaybe<Order_By>;
};

/** primary key columns input for table: workers */
export type Workers_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "workers" */
export enum Workers_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LastCheckIn = 'last_check_in'
}

/** input type for updating data in table "workers" */
export type Workers_Set_Input = {
  last_check_in?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "workers" */
export type Workers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Workers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Workers_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  last_check_in?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "workers" */
export enum Workers_Update_Column {
  /** column name */
  LastCheckIn = 'last_check_in'
}

export type Workers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Workers_Set_Input>;
  where: Workers_Bool_Exp;
};

export type NewJobsSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewJobsSubscriptionSubscription = { __typename?: 'subscription_root', available_jobs: Array<{ __typename?: 'job', id: string }> };

export type DeleteJobsSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DeleteJobsSubscriptionSubscription = { __typename?: 'subscription_root', delete_job: Array<{ __typename?: 'delete_job', id: string }> };

export type MyJobsSubscriptionSubscriptionVariables = Exact<{
  myId: Scalars['uuid'];
}>;


export type MyJobsSubscriptionSubscription = { __typename?: 'subscription_root', job: Array<{ __typename?: 'job', id: string }> };

export type FullJobFragment = { __typename?: 'job', id: string, workspace_id: string, url?: string | null, progress?: number | null, status: Job_Status_Enum_Enum, name: string, description: string, path: any, option_cut_start?: number | null, option_cut_end?: number | null, option_fade_in?: number | null, option_fade_out?: number | null, file_upload?: { __typename?: 'file_upload', id: string, base64: string } | null };

export type ClaimJobMutationVariables = Exact<{
  myId: Scalars['uuid'];
}>;


export type ClaimJobMutation = { __typename?: 'mutation_root', claim_job?: { __typename?: 'job', id: string, workspace_id: string, url?: string | null, progress?: number | null, status: Job_Status_Enum_Enum, name: string, description: string, path: any, option_cut_start?: number | null, option_cut_end?: number | null, option_fade_in?: number | null, option_fade_out?: number | null, file_upload?: { __typename?: 'file_upload', id: string, base64: string } | null } | null };

export type ClaimDeleteJobMutationVariables = Exact<{
  myId: Scalars['uuid'];
}>;


export type ClaimDeleteJobMutation = { __typename?: 'mutation_root', claim_delete_job?: { __typename?: 'delete_job', id: string, file: { __typename?: 'file', id: string, provider_id?: string | null } } | null };

export type UpdateJobProgressMutationVariables = Exact<{
  jobId: Scalars['uuid'];
  progressStage: Job_Status_Enum_Enum;
  progress: Scalars['numeric'];
}>;


export type UpdateJobProgressMutation = { __typename?: 'mutation_root', update_job_by_pk?: { __typename?: 'job', id: string, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null } | null };

export type CommitJobMutationVariables = Exact<{
  jobId: Scalars['uuid'];
  file: File_Insert_Input;
}>;


export type CommitJobMutation = { __typename?: 'mutation_root', delete_job_by_pk?: { __typename: 'job', id: string, url?: string | null, name: string } | null, insert_file_one?: { __typename: 'file', id: string, name: string } | null };

export type CommitDeleteJobMutationVariables = Exact<{
  jobId: Scalars['uuid'];
  fileId: Scalars['uuid'];
}>;


export type CommitDeleteJobMutation = { __typename?: 'mutation_root', delete_delete_job_by_pk?: { __typename?: 'delete_job', id: string } | null, delete_file_by_pk?: { __typename?: 'file', id: string } | null };

export type SetJobErrorMutationVariables = Exact<{
  jobId: Scalars['uuid'];
  error: Scalars['String'];
}>;


export type SetJobErrorMutation = { __typename?: 'mutation_root', update_job_by_pk?: { __typename?: 'job', id: string, workspace_id: string, url?: string | null, progress?: number | null, status: Job_Status_Enum_Enum, name: string, description: string, path: any, option_cut_start?: number | null, option_cut_end?: number | null, option_fade_in?: number | null, option_fade_out?: number | null, file_upload?: { __typename?: 'file_upload', id: string, base64: string } | null } | null };

export type CheckInMutationVariables = Exact<{
  myId: Scalars['uuid'];
}>;


export type CheckInMutation = { __typename?: 'mutation_root', insert_workers_one?: { __typename?: 'workers', id: string, last_check_in: Date } | null };

export const FullJobFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullJob"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"job"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspace_id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"file_upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base64"}}]}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"option_cut_start"}},{"kind":"Field","name":{"kind":"Name","value":"option_cut_end"}},{"kind":"Field","name":{"kind":"Name","value":"option_fade_in"}},{"kind":"Field","name":{"kind":"Name","value":"option_fade_out"}}]}}]} as unknown as DocumentNode<FullJobFragment, unknown>;
export const NewJobsSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewJobsSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available_jobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<NewJobsSubscriptionSubscription, NewJobsSubscriptionSubscriptionVariables>;
export const DeleteJobsSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeleteJobsSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assigned_worker"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteJobsSubscriptionSubscription, DeleteJobsSubscriptionSubscriptionVariables>;
export const MyJobsSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MyJobsSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"myId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assigned_worker"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"myId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MyJobsSubscriptionSubscription, MyJobsSubscriptionSubscriptionVariables>;
export const ClaimJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClaimJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"myId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claim_job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"worker_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"myId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FullJob"}}]}}]}},...FullJobFragmentDoc.definitions]} as unknown as DocumentNode<ClaimJobMutation, ClaimJobMutationVariables>;
export const ClaimDeleteJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClaimDeleteJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"myId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claim_delete_job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"worker_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"myId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}}]} as unknown as DocumentNode<ClaimDeleteJobMutation, ClaimDeleteJobMutationVariables>;
export const UpdateJobProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJobProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progressStage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"job_status_enum_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"numeric"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_job_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progressStage"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"progress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progress"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_worker"}}]}}]}}]} as unknown as DocumentNode<UpdateJobProgressMutation, UpdateJobProgressMutationVariables>;
export const CommitJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"file_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_job_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_file_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommitJobMutation, CommitJobMutationVariables>;
export const CommitDeleteJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitDeleteJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_delete_job_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_file_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CommitDeleteJobMutation, CommitDeleteJobMutationVariables>;
export const SetJobErrorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetJobError"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"error"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_job_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"error"},"value":{"kind":"Variable","name":{"kind":"Name","value":"error"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"EnumValue","value":"error"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FullJob"}}]}}]}},...FullJobFragmentDoc.definitions]} as unknown as DocumentNode<SetJobErrorMutation, SetJobErrorMutationVariables>;
export const CheckInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"myId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_workers_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"myId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"last_check_in"},"value":{"kind":"EnumValue","value":"now"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"on_conflict"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"constraint"},"value":{"kind":"EnumValue","value":"workers_pkey"}},{"kind":"ObjectField","name":{"kind":"Name","value":"update_columns"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"last_check_in"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"last_check_in"}}]}}]}}]} as unknown as DocumentNode<CheckInMutation, CheckInMutationVariables>;