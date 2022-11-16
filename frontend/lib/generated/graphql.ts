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
  float8: unknown;
  jsonb: any;
  numeric: number;
  timestamptz: string;
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

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** one set of tracks playing */
export type Deck = {
  __typename?: 'deck';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  pause_timestamp?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  queue: Array<Track>;
  speed: Scalars['numeric'];
  start_timestamp: Scalars['timestamptz'];
  type: Deck_Type_Enum_Enum;
  volume: Scalars['numeric'];
  /** An object relationship */
  workspace: Workspace;
  workspace_id: Scalars['uuid'];
};


/** one set of tracks playing */
export type DeckQueueArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};

/** order by aggregate values of table "deck" */
export type Deck_Aggregate_Order_By = {
  avg?: InputMaybe<Deck_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Deck_Max_Order_By>;
  min?: InputMaybe<Deck_Min_Order_By>;
  stddev?: InputMaybe<Deck_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Deck_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Deck_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Deck_Sum_Order_By>;
  var_pop?: InputMaybe<Deck_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Deck_Var_Samp_Order_By>;
  variance?: InputMaybe<Deck_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "deck" */
export type Deck_Arr_Rel_Insert_Input = {
  data: Array<Deck_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};

/** order by avg() on columns of table "deck" */
export type Deck_Avg_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "deck". All fields are combined with a logical 'AND'. */
export type Deck_Bool_Exp = {
  _and?: InputMaybe<Array<Deck_Bool_Exp>>;
  _not?: InputMaybe<Deck_Bool_Exp>;
  _or?: InputMaybe<Array<Deck_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pause_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  queue?: InputMaybe<Track_Bool_Exp>;
  speed?: InputMaybe<Numeric_Comparison_Exp>;
  start_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  type?: InputMaybe<Deck_Type_Enum_Enum_Comparison_Exp>;
  volume?: InputMaybe<Numeric_Comparison_Exp>;
  workspace?: InputMaybe<Workspace_Bool_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "deck" */
export enum Deck_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeckPkey = 'deck_pkey'
}

/** input type for incrementing numeric columns in table "deck" */
export type Deck_Inc_Input = {
  speed?: InputMaybe<Scalars['numeric']>;
  volume?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "deck" */
export type Deck_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  pause_timestamp?: InputMaybe<Scalars['timestamptz']>;
  queue?: InputMaybe<Track_Arr_Rel_Insert_Input>;
  speed?: InputMaybe<Scalars['numeric']>;
  start_timestamp?: InputMaybe<Scalars['timestamptz']>;
  type?: InputMaybe<Deck_Type_Enum_Enum>;
  volume?: InputMaybe<Scalars['numeric']>;
  workspace?: InputMaybe<Workspace_Obj_Rel_Insert_Input>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "deck" */
export type Deck_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "deck" */
export type Deck_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "deck" */
export type Deck_Mutation_Response = {
  __typename?: 'deck_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Deck>;
};

/** input type for inserting object relation for remote table "deck" */
export type Deck_Obj_Rel_Insert_Input = {
  data: Deck_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};

/** on_conflict condition type for table "deck" */
export type Deck_On_Conflict = {
  constraint: Deck_Constraint;
  update_columns?: Array<Deck_Update_Column>;
  where?: InputMaybe<Deck_Bool_Exp>;
};

/** Ordering options when selecting data from "deck". */
export type Deck_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pause_timestamp?: InputMaybe<Order_By>;
  queue_aggregate?: InputMaybe<Track_Aggregate_Order_By>;
  speed?: InputMaybe<Order_By>;
  start_timestamp?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
  workspace?: InputMaybe<Workspace_Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: deck */
export type Deck_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "deck" */
export enum Deck_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PauseTimestamp = 'pause_timestamp',
  /** column name */
  Speed = 'speed',
  /** column name */
  StartTimestamp = 'start_timestamp',
  /** column name */
  Type = 'type',
  /** column name */
  Volume = 'volume',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "deck" */
export type Deck_Set_Input = {
  pause_timestamp?: InputMaybe<Scalars['timestamptz']>;
  speed?: InputMaybe<Scalars['numeric']>;
  start_timestamp?: InputMaybe<Scalars['timestamptz']>;
  volume?: InputMaybe<Scalars['numeric']>;
};

/** order by stddev() on columns of table "deck" */
export type Deck_Stddev_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "deck" */
export type Deck_Stddev_Pop_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "deck" */
export type Deck_Stddev_Samp_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "deck" */
export type Deck_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Deck_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Deck_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  pause_timestamp?: InputMaybe<Scalars['timestamptz']>;
  speed?: InputMaybe<Scalars['numeric']>;
  start_timestamp?: InputMaybe<Scalars['timestamptz']>;
  type?: InputMaybe<Deck_Type_Enum_Enum>;
  volume?: InputMaybe<Scalars['numeric']>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by sum() on columns of table "deck" */
export type Deck_Sum_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

export enum Deck_Type_Enum_Enum {
  /** any ambience */
  Ambience = 'ambience',
  /** the main player */
  Main = 'main',
  /** any ambience */
  Sfx = 'sfx'
}

/** Boolean expression to compare columns of type "deck_type_enum_enum". All fields are combined with logical 'AND'. */
export type Deck_Type_Enum_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Deck_Type_Enum_Enum>;
  _in?: InputMaybe<Array<Deck_Type_Enum_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Deck_Type_Enum_Enum>;
  _nin?: InputMaybe<Array<Deck_Type_Enum_Enum>>;
};

/** update columns of table "deck" */
export enum Deck_Update_Column {
  /** column name */
  PauseTimestamp = 'pause_timestamp',
  /** column name */
  Speed = 'speed',
  /** column name */
  StartTimestamp = 'start_timestamp',
  /** column name */
  Volume = 'volume'
}

export type Deck_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Deck_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Deck_Set_Input>;
  where: Deck_Bool_Exp;
};

/** order by var_pop() on columns of table "deck" */
export type Deck_Var_Pop_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "deck" */
export type Deck_Var_Samp_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "deck" */
export type Deck_Variance_Order_By = {
  speed?: InputMaybe<Order_By>;
  volume?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "delete_job". All fields are combined with a logical 'AND'. */
export type Delete_Job_Bool_Exp = {
  _and?: InputMaybe<Array<Delete_Job_Bool_Exp>>;
  _not?: InputMaybe<Delete_Job_Bool_Exp>;
  _or?: InputMaybe<Array<Delete_Job_Bool_Exp>>;
};

/** unique or primary key constraints on table "delete_job" */
export enum Delete_Job_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeleteJobPkey = 'delete_job_pkey'
}

/** input type for inserting data into table "delete_job" */
export type Delete_Job_Insert_Input = {
  single_id?: InputMaybe<Scalars['uuid']>;
};

/** response of any mutation on the table "delete_job" */
export type Delete_Job_Mutation_Response = {
  __typename?: 'delete_job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
};

/** on_conflict condition type for table "delete_job" */
export type Delete_Job_On_Conflict = {
  constraint: Delete_Job_Constraint;
  update_columns?: Array<Delete_Job_Update_Column>;
  where?: InputMaybe<Delete_Job_Bool_Exp>;
};

/** placeholder for update columns of table "delete_job" (current role has no relevant permissions) */
export enum Delete_Job_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

/** columns and relationships of "directory_entry" */
export type Directory_Entry = {
  __typename?: 'directory_entry';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  folder?: Maybe<Folder>;
  id: Scalars['uuid'];
  name: Scalars['String'];
  ordering?: Maybe<Scalars['bigint']>;
  path: Scalars['jsonb'];
  /** An object relationship */
  single?: Maybe<Single>;
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  workspace: Workspace;
  workspace_id: Scalars['uuid'];
};


/** columns and relationships of "directory_entry" */
export type Directory_EntryPathArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** order by aggregate values of table "directory_entry" */
export type Directory_Entry_Aggregate_Order_By = {
  avg?: InputMaybe<Directory_Entry_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Directory_Entry_Max_Order_By>;
  min?: InputMaybe<Directory_Entry_Min_Order_By>;
  stddev?: InputMaybe<Directory_Entry_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Directory_Entry_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Directory_Entry_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Directory_Entry_Sum_Order_By>;
  var_pop?: InputMaybe<Directory_Entry_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Directory_Entry_Var_Samp_Order_By>;
  variance?: InputMaybe<Directory_Entry_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Directory_Entry_Append_Input = {
  path?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "directory_entry" */
export type Directory_Entry_Arr_Rel_Insert_Input = {
  data: Array<Directory_Entry_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Directory_Entry_On_Conflict>;
};

/** order by avg() on columns of table "directory_entry" */
export type Directory_Entry_Avg_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "directory_entry". All fields are combined with a logical 'AND'. */
export type Directory_Entry_Bool_Exp = {
  _and?: InputMaybe<Array<Directory_Entry_Bool_Exp>>;
  _not?: InputMaybe<Directory_Entry_Bool_Exp>;
  _or?: InputMaybe<Array<Directory_Entry_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  folder?: InputMaybe<Folder_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  ordering?: InputMaybe<Bigint_Comparison_Exp>;
  path?: InputMaybe<Jsonb_Comparison_Exp>;
  single?: InputMaybe<Single_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  workspace?: InputMaybe<Workspace_Bool_Exp>;
  workspace_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "directory_entry" */
export enum Directory_Entry_Constraint {
  /** unique or primary key constraint on columns "id" */
  DirectoryEntryPkey = 'directory_entry_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Directory_Entry_Delete_At_Path_Input = {
  path?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Directory_Entry_Delete_Elem_Input = {
  path?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Directory_Entry_Delete_Key_Input = {
  path?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "directory_entry" */
export type Directory_Entry_Inc_Input = {
  ordering?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "directory_entry" */
export type Directory_Entry_Insert_Input = {
  folder?: InputMaybe<Folder_Obj_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
  workspace?: InputMaybe<Workspace_Obj_Rel_Insert_Input>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "directory_entry" */
export type Directory_Entry_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "directory_entry" */
export type Directory_Entry_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "directory_entry" */
export type Directory_Entry_Mutation_Response = {
  __typename?: 'directory_entry_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Directory_Entry>;
};

/** input type for inserting object relation for remote table "directory_entry" */
export type Directory_Entry_Obj_Rel_Insert_Input = {
  data: Directory_Entry_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Directory_Entry_On_Conflict>;
};

/** on_conflict condition type for table "directory_entry" */
export type Directory_Entry_On_Conflict = {
  constraint: Directory_Entry_Constraint;
  update_columns?: Array<Directory_Entry_Update_Column>;
  where?: InputMaybe<Directory_Entry_Bool_Exp>;
};

/** Ordering options when selecting data from "directory_entry". */
export type Directory_Entry_Order_By = {
  created_at?: InputMaybe<Order_By>;
  folder?: InputMaybe<Folder_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  single?: InputMaybe<Single_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  workspace?: InputMaybe<Workspace_Order_By>;
  workspace_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: directory_entry */
export type Directory_Entry_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Directory_Entry_Prepend_Input = {
  path?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "directory_entry" */
export enum Directory_Entry_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Ordering = 'ordering',
  /** column name */
  Path = 'path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "directory_entry" */
export type Directory_Entry_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
};

/** order by stddev() on columns of table "directory_entry" */
export type Directory_Entry_Stddev_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "directory_entry" */
export type Directory_Entry_Stddev_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "directory_entry" */
export type Directory_Entry_Stddev_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "directory_entry" */
export type Directory_Entry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Directory_Entry_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Directory_Entry_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  path?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by sum() on columns of table "directory_entry" */
export type Directory_Entry_Sum_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** update columns of table "directory_entry" */
export enum Directory_Entry_Update_Column {
  /** column name */
  Name = 'name',
  /** column name */
  Ordering = 'ordering',
  /** column name */
  Path = 'path'
}

export type Directory_Entry_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Directory_Entry_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Directory_Entry_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Directory_Entry_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Directory_Entry_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Directory_Entry_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Directory_Entry_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Directory_Entry_Set_Input>;
  where: Directory_Entry_Bool_Exp;
};

/** order by var_pop() on columns of table "directory_entry" */
export type Directory_Entry_Var_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "directory_entry" */
export type Directory_Entry_Var_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "directory_entry" */
export type Directory_Entry_Variance_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** columns and relationships of "file_upload" */
export type File_Upload = {
  __typename?: 'file_upload';
  id: Scalars['uuid'];
};

/** Boolean expression to filter rows from the table "file_upload". All fields are combined with a logical 'AND'. */
export type File_Upload_Bool_Exp = {
  _and?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  _not?: InputMaybe<File_Upload_Bool_Exp>;
  _or?: InputMaybe<Array<File_Upload_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "file_upload" */
export enum File_Upload_Constraint {
  /** unique or primary key constraint on columns "id" */
  FileUploadsPkey = 'file_uploads_pkey'
}

/** input type for inserting data into table "file_upload" */
export type File_Upload_Insert_Input = {
  base64?: InputMaybe<Scalars['String']>;
};

/** response of any mutation on the table "file_upload" */
export type File_Upload_Mutation_Response = {
  __typename?: 'file_upload_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<File_Upload>;
};

/** input type for inserting object relation for remote table "file_upload" */
export type File_Upload_Obj_Rel_Insert_Input = {
  data: File_Upload_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<File_Upload_On_Conflict>;
};

/** on_conflict condition type for table "file_upload" */
export type File_Upload_On_Conflict = {
  constraint: File_Upload_Constraint;
  update_columns?: Array<File_Upload_Update_Column>;
  where?: InputMaybe<File_Upload_Bool_Exp>;
};

/** Ordering options when selecting data from "file_upload". */
export type File_Upload_Order_By = {
  id?: InputMaybe<Order_By>;
};

/** select columns of table "file_upload" */
export enum File_Upload_Select_Column {
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
  id?: InputMaybe<Scalars['uuid']>;
};

/** placeholder for update columns of table "file_upload" (current role has no relevant permissions) */
export enum File_Upload_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

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

/** columns and relationships of "folder" */
export type Folder = {
  __typename?: 'folder';
  created_at: Scalars['timestamptz'];
  directory_entry_id: Scalars['uuid'];
  /** An object relationship */
  dirent: Directory_Entry;
  id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** Boolean expression to filter rows from the table "folder". All fields are combined with a logical 'AND'. */
export type Folder_Bool_Exp = {
  _and?: InputMaybe<Array<Folder_Bool_Exp>>;
  _not?: InputMaybe<Folder_Bool_Exp>;
  _or?: InputMaybe<Array<Folder_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  directory_entry_id?: InputMaybe<Uuid_Comparison_Exp>;
  dirent?: InputMaybe<Directory_Entry_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "folder" */
export enum Folder_Constraint {
  /** unique or primary key constraint on columns "directory_entry_id" */
  FolderDirectoryEntryIdKey = 'folder_directory_entry_id_key',
  /** unique or primary key constraint on columns "id" */
  FolderPkey = 'folder_pkey'
}

/** input type for inserting data into table "folder" */
export type Folder_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  directory_entry_id?: InputMaybe<Scalars['uuid']>;
  dirent?: InputMaybe<Directory_Entry_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "folder" */
export type Folder_Mutation_Response = {
  __typename?: 'folder_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Folder>;
};

/** input type for inserting object relation for remote table "folder" */
export type Folder_Obj_Rel_Insert_Input = {
  data: Folder_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Folder_On_Conflict>;
};

/** on_conflict condition type for table "folder" */
export type Folder_On_Conflict = {
  constraint: Folder_Constraint;
  update_columns?: Array<Folder_Update_Column>;
  where?: InputMaybe<Folder_Bool_Exp>;
};

/** Ordering options when selecting data from "folder". */
export type Folder_Order_By = {
  created_at?: InputMaybe<Order_By>;
  directory_entry_id?: InputMaybe<Order_By>;
  dirent?: InputMaybe<Directory_Entry_Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** select columns of table "folder" */
export enum Folder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DirectoryEntryId = 'directory_entry_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Streaming cursor of the table "folder" */
export type Folder_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Folder_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Folder_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  directory_entry_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** placeholder for update columns of table "folder" (current role has no relevant permissions) */
export enum Folder_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

/** columns and relationships of "job" */
export type Job = {
  __typename?: 'job';
  assign_time?: Maybe<Scalars['timestamptz']>;
  assigned_worker?: Maybe<Scalars['uuid']>;
  created_at: Scalars['timestamptz'];
  description: Scalars['String'];
  error?: Maybe<Scalars['String']>;
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

/** input type for inserting array relation for remote table "job" */
export type Job_Arr_Rel_Insert_Input = {
  data: Array<Job_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Job_On_Conflict>;
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
  error?: InputMaybe<String_Comparison_Exp>;
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

/** unique or primary key constraints on table "job" */
export enum Job_Constraint {
  /** unique or primary key constraint on columns "id" */
  JobPkey = 'job_pkey'
}

/** input type for inserting data into table "job" */
export type Job_Insert_Input = {
  description?: InputMaybe<Scalars['String']>;
  file_upload?: InputMaybe<File_Upload_Obj_Rel_Insert_Input>;
  file_upload_id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  option_cut_end?: InputMaybe<Scalars['float8']>;
  option_cut_start?: InputMaybe<Scalars['float8']>;
  option_fade_in?: InputMaybe<Scalars['float8']>;
  option_fade_out?: InputMaybe<Scalars['float8']>;
  path?: InputMaybe<Scalars['jsonb']>;
  url?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "job" */
export type Job_Max_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
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
  error?: InputMaybe<Order_By>;
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

/** on_conflict condition type for table "job" */
export type Job_On_Conflict = {
  constraint: Job_Constraint;
  update_columns?: Array<Job_Update_Column>;
  where?: InputMaybe<Job_Bool_Exp>;
};

/** Ordering options when selecting data from "job". */
export type Job_Order_By = {
  assign_time?: InputMaybe<Order_By>;
  assigned_worker?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
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
  Error = 'error',
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
  error?: InputMaybe<Scalars['String']>;
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

/** placeholder for update columns of table "job" (current role has no relevant permissions) */
export enum Job_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

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
  /** delete data from the table: "deck" */
  delete_deck?: Maybe<Deck_Mutation_Response>;
  /** delete single row from the table: "deck" */
  delete_deck_by_pk?: Maybe<Deck>;
  /** delete data from the table: "directory_entry" */
  delete_directory_entry?: Maybe<Directory_Entry_Mutation_Response>;
  /** delete single row from the table: "directory_entry" */
  delete_directory_entry_by_pk?: Maybe<Directory_Entry>;
  /** delete data from the table: "job" */
  delete_job?: Maybe<Job_Mutation_Response>;
  /** delete single row from the table: "job" */
  delete_job_by_pk?: Maybe<Job>;
  /** delete data from the table: "track" */
  delete_track?: Maybe<Track_Mutation_Response>;
  /** delete single row from the table: "track" */
  delete_track_by_pk?: Maybe<Track>;
  /** insert data into the table: "deck" */
  insert_deck?: Maybe<Deck_Mutation_Response>;
  /** insert a single row into the table: "deck" */
  insert_deck_one?: Maybe<Deck>;
  /** insert data into the table: "delete_job" */
  insert_delete_job?: Maybe<Delete_Job_Mutation_Response>;
  /** insert data into the table: "directory_entry" */
  insert_directory_entry?: Maybe<Directory_Entry_Mutation_Response>;
  /** insert a single row into the table: "directory_entry" */
  insert_directory_entry_one?: Maybe<Directory_Entry>;
  /** insert data into the table: "file_upload" */
  insert_file_upload?: Maybe<File_Upload_Mutation_Response>;
  /** insert a single row into the table: "file_upload" */
  insert_file_upload_one?: Maybe<File_Upload>;
  /** insert data into the table: "folder" */
  insert_folder?: Maybe<Folder_Mutation_Response>;
  /** insert a single row into the table: "folder" */
  insert_folder_one?: Maybe<Folder>;
  /** insert data into the table: "job" */
  insert_job?: Maybe<Job_Mutation_Response>;
  /** insert a single row into the table: "job" */
  insert_job_one?: Maybe<Job>;
  /** insert data into the table: "track" */
  insert_track?: Maybe<Track_Mutation_Response>;
  /** insert a single row into the table: "track" */
  insert_track_one?: Maybe<Track>;
  /** insert data into the table: "workspace" */
  insert_workspace?: Maybe<Workspace_Mutation_Response>;
  /** insert a single row into the table: "workspace" */
  insert_workspace_one?: Maybe<Workspace>;
  /** update data of the table: "deck" */
  update_deck?: Maybe<Deck_Mutation_Response>;
  /** update single row of the table: "deck" */
  update_deck_by_pk?: Maybe<Deck>;
  /** update multiples rows of table: "deck" */
  update_deck_many?: Maybe<Array<Maybe<Deck_Mutation_Response>>>;
  /** update data of the table: "directory_entry" */
  update_directory_entry?: Maybe<Directory_Entry_Mutation_Response>;
  /** update single row of the table: "directory_entry" */
  update_directory_entry_by_pk?: Maybe<Directory_Entry>;
  /** update multiples rows of table: "directory_entry" */
  update_directory_entry_many?: Maybe<Array<Maybe<Directory_Entry_Mutation_Response>>>;
  /** update data of the table: "single" */
  update_single?: Maybe<Single_Mutation_Response>;
  /** update single row of the table: "single" */
  update_single_by_pk?: Maybe<Single>;
  /** update multiples rows of table: "single" */
  update_single_many?: Maybe<Array<Maybe<Single_Mutation_Response>>>;
  /** update data of the table: "workspace" */
  update_workspace?: Maybe<Workspace_Mutation_Response>;
  /** update single row of the table: "workspace" */
  update_workspace_by_pk?: Maybe<Workspace>;
  /** update multiples rows of table: "workspace" */
  update_workspace_many?: Maybe<Array<Maybe<Workspace_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_DeckArgs = {
  where: Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Deck_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Directory_EntryArgs = {
  where: Directory_Entry_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Directory_Entry_By_PkArgs = {
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
export type Mutation_RootDelete_TrackArgs = {
  where: Track_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Track_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_DeckArgs = {
  objects: Array<Deck_Insert_Input>;
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Deck_OneArgs = {
  object: Deck_Insert_Input;
  on_conflict?: InputMaybe<Deck_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Delete_JobArgs = {
  objects: Array<Delete_Job_Insert_Input>;
  on_conflict?: InputMaybe<Delete_Job_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Directory_EntryArgs = {
  objects: Array<Directory_Entry_Insert_Input>;
  on_conflict?: InputMaybe<Directory_Entry_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Directory_Entry_OneArgs = {
  object: Directory_Entry_Insert_Input;
  on_conflict?: InputMaybe<Directory_Entry_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_File_UploadArgs = {
  objects: Array<File_Upload_Insert_Input>;
  on_conflict?: InputMaybe<File_Upload_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_File_Upload_OneArgs = {
  object: File_Upload_Insert_Input;
  on_conflict?: InputMaybe<File_Upload_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FolderArgs = {
  objects: Array<Folder_Insert_Input>;
  on_conflict?: InputMaybe<Folder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Folder_OneArgs = {
  object: Folder_Insert_Input;
  on_conflict?: InputMaybe<Folder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_JobArgs = {
  objects: Array<Job_Insert_Input>;
  on_conflict?: InputMaybe<Job_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Job_OneArgs = {
  object: Job_Insert_Input;
  on_conflict?: InputMaybe<Job_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TrackArgs = {
  objects: Array<Track_Insert_Input>;
  on_conflict?: InputMaybe<Track_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Track_OneArgs = {
  object: Track_Insert_Input;
  on_conflict?: InputMaybe<Track_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WorkspaceArgs = {
  objects: Array<Workspace_Insert_Input>;
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Workspace_OneArgs = {
  object: Workspace_Insert_Input;
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_DeckArgs = {
  _inc?: InputMaybe<Deck_Inc_Input>;
  _set?: InputMaybe<Deck_Set_Input>;
  where: Deck_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Deck_By_PkArgs = {
  _inc?: InputMaybe<Deck_Inc_Input>;
  _set?: InputMaybe<Deck_Set_Input>;
  pk_columns: Deck_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Deck_ManyArgs = {
  updates: Array<Deck_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Directory_EntryArgs = {
  _append?: InputMaybe<Directory_Entry_Append_Input>;
  _delete_at_path?: InputMaybe<Directory_Entry_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Directory_Entry_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Directory_Entry_Delete_Key_Input>;
  _inc?: InputMaybe<Directory_Entry_Inc_Input>;
  _prepend?: InputMaybe<Directory_Entry_Prepend_Input>;
  _set?: InputMaybe<Directory_Entry_Set_Input>;
  where: Directory_Entry_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Directory_Entry_By_PkArgs = {
  _append?: InputMaybe<Directory_Entry_Append_Input>;
  _delete_at_path?: InputMaybe<Directory_Entry_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Directory_Entry_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Directory_Entry_Delete_Key_Input>;
  _inc?: InputMaybe<Directory_Entry_Inc_Input>;
  _prepend?: InputMaybe<Directory_Entry_Prepend_Input>;
  _set?: InputMaybe<Directory_Entry_Set_Input>;
  pk_columns: Directory_Entry_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Directory_Entry_ManyArgs = {
  updates: Array<Directory_Entry_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_SingleArgs = {
  _set?: InputMaybe<Single_Set_Input>;
  where: Single_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Single_By_PkArgs = {
  _set?: InputMaybe<Single_Set_Input>;
  pk_columns: Single_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Single_ManyArgs = {
  updates: Array<Single_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_WorkspaceArgs = {
  _set?: InputMaybe<Workspace_Set_Input>;
  where: Workspace_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Workspace_By_PkArgs = {
  _set?: InputMaybe<Workspace_Set_Input>;
  pk_columns: Workspace_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Workspace_ManyArgs = {
  updates: Array<Workspace_Updates>;
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
  /** fetch data from the table: "deck" */
  deck: Array<Deck>;
  /** fetch data from the table: "deck" using primary key columns */
  deck_by_pk?: Maybe<Deck>;
  /** fetch data from the table: "directory_entry" */
  directory_entry: Array<Directory_Entry>;
  /** fetch data from the table: "directory_entry" using primary key columns */
  directory_entry_by_pk?: Maybe<Directory_Entry>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table: "folder" */
  folder: Array<Folder>;
  /** fetch data from the table: "folder" using primary key columns */
  folder_by_pk?: Maybe<Folder>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table: "single" */
  single: Array<Single>;
  /** fetch data from the table: "single" using primary key columns */
  single_by_pk?: Maybe<Single>;
  /** fetch data from the table: "track" */
  track: Array<Track>;
  /** fetch data from the table: "track" using primary key columns */
  track_by_pk?: Maybe<Track>;
  /** fetch data from the table: "workspace" */
  workspace: Array<Workspace>;
  /** fetch data from the table: "workspace" using primary key columns */
  workspace_by_pk?: Maybe<Workspace>;
};


export type Query_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootDeckArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


export type Query_RootDeck_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootDirectory_EntryArgs = {
  distinct_on?: InputMaybe<Array<Directory_Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Directory_Entry_Order_By>>;
  where?: InputMaybe<Directory_Entry_Bool_Exp>;
};


export type Query_RootDirectory_Entry_By_PkArgs = {
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


export type Query_RootFolderArgs = {
  distinct_on?: InputMaybe<Array<Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Folder_Order_By>>;
  where?: InputMaybe<Folder_Bool_Exp>;
};


export type Query_RootFolder_By_PkArgs = {
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


export type Query_RootSingleArgs = {
  distinct_on?: InputMaybe<Array<Single_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Single_Order_By>>;
  where?: InputMaybe<Single_Bool_Exp>;
};


export type Query_RootSingle_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTrackArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};


export type Query_RootTrack_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWorkspaceArgs = {
  distinct_on?: InputMaybe<Array<Workspace_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workspace_Order_By>>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};


export type Query_RootWorkspace_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "single" */
export type Single = {
  __typename?: 'single';
  description: Scalars['String'];
  directory_entry_id: Scalars['uuid'];
  /** An object relationship */
  dirent: Directory_Entry;
  download_url: Scalars['String'];
  id: Scalars['uuid'];
  length: Scalars['numeric'];
};

/** Boolean expression to filter rows from the table "single". All fields are combined with a logical 'AND'. */
export type Single_Bool_Exp = {
  _and?: InputMaybe<Array<Single_Bool_Exp>>;
  _not?: InputMaybe<Single_Bool_Exp>;
  _or?: InputMaybe<Array<Single_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  directory_entry_id?: InputMaybe<Uuid_Comparison_Exp>;
  dirent?: InputMaybe<Directory_Entry_Bool_Exp>;
  download_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  length?: InputMaybe<Numeric_Comparison_Exp>;
};

/** response of any mutation on the table "single" */
export type Single_Mutation_Response = {
  __typename?: 'single_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Single>;
};

/** Ordering options when selecting data from "single". */
export type Single_Order_By = {
  description?: InputMaybe<Order_By>;
  directory_entry_id?: InputMaybe<Order_By>;
  dirent?: InputMaybe<Directory_Entry_Order_By>;
  download_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** primary key columns input for table: single */
export type Single_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "single" */
export enum Single_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  DirectoryEntryId = 'directory_entry_id',
  /** column name */
  DownloadUrl = 'download_url',
  /** column name */
  Id = 'id',
  /** column name */
  Length = 'length'
}

/** input type for updating data in table "single" */
export type Single_Set_Input = {
  description?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "single" */
export type Single_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Single_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Single_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']>;
  directory_entry_id?: InputMaybe<Scalars['uuid']>;
  download_url?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  length?: InputMaybe<Scalars['numeric']>;
};

export type Single_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Single_Set_Input>;
  where: Single_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** execute function "available_jobs" which returns "job" */
  available_jobs: Array<Job>;
  /** fetch data from the table: "deck" */
  deck: Array<Deck>;
  /** fetch data from the table: "deck" using primary key columns */
  deck_by_pk?: Maybe<Deck>;
  /** fetch data from the table in a streaming manner : "deck" */
  deck_stream: Array<Deck>;
  /** fetch data from the table: "directory_entry" */
  directory_entry: Array<Directory_Entry>;
  /** fetch data from the table: "directory_entry" using primary key columns */
  directory_entry_by_pk?: Maybe<Directory_Entry>;
  /** fetch data from the table in a streaming manner : "directory_entry" */
  directory_entry_stream: Array<Directory_Entry>;
  /** fetch data from the table: "file_upload" */
  file_upload: Array<File_Upload>;
  /** fetch data from the table: "file_upload" using primary key columns */
  file_upload_by_pk?: Maybe<File_Upload>;
  /** fetch data from the table in a streaming manner : "file_upload" */
  file_upload_stream: Array<File_Upload>;
  /** fetch data from the table: "folder" */
  folder: Array<Folder>;
  /** fetch data from the table: "folder" using primary key columns */
  folder_by_pk?: Maybe<Folder>;
  /** fetch data from the table in a streaming manner : "folder" */
  folder_stream: Array<Folder>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table in a streaming manner : "job" */
  job_stream: Array<Job>;
  /** fetch data from the table: "single" */
  single: Array<Single>;
  /** fetch data from the table: "single" using primary key columns */
  single_by_pk?: Maybe<Single>;
  /** fetch data from the table in a streaming manner : "single" */
  single_stream: Array<Single>;
  /** fetch data from the table: "track" */
  track: Array<Track>;
  /** fetch data from the table: "track" using primary key columns */
  track_by_pk?: Maybe<Track>;
  /** fetch data from the table in a streaming manner : "track" */
  track_stream: Array<Track>;
  /** fetch data from the table: "workspace" */
  workspace: Array<Workspace>;
  /** fetch data from the table: "workspace" using primary key columns */
  workspace_by_pk?: Maybe<Workspace>;
  /** fetch data from the table in a streaming manner : "workspace" */
  workspace_stream: Array<Workspace>;
};


export type Subscription_RootAvailable_JobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootDeckArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


export type Subscription_RootDeck_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDeck_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Deck_Stream_Cursor_Input>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


export type Subscription_RootDirectory_EntryArgs = {
  distinct_on?: InputMaybe<Array<Directory_Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Directory_Entry_Order_By>>;
  where?: InputMaybe<Directory_Entry_Bool_Exp>;
};


export type Subscription_RootDirectory_Entry_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDirectory_Entry_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Directory_Entry_Stream_Cursor_Input>>;
  where?: InputMaybe<Directory_Entry_Bool_Exp>;
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


export type Subscription_RootFolderArgs = {
  distinct_on?: InputMaybe<Array<Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Folder_Order_By>>;
  where?: InputMaybe<Folder_Bool_Exp>;
};


export type Subscription_RootFolder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFolder_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Folder_Stream_Cursor_Input>>;
  where?: InputMaybe<Folder_Bool_Exp>;
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


export type Subscription_RootSingleArgs = {
  distinct_on?: InputMaybe<Array<Single_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Single_Order_By>>;
  where?: InputMaybe<Single_Bool_Exp>;
};


export type Subscription_RootSingle_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootSingle_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Single_Stream_Cursor_Input>>;
  where?: InputMaybe<Single_Bool_Exp>;
};


export type Subscription_RootTrackArgs = {
  distinct_on?: InputMaybe<Array<Track_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Track_Order_By>>;
  where?: InputMaybe<Track_Bool_Exp>;
};


export type Subscription_RootTrack_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTrack_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Track_Stream_Cursor_Input>>;
  where?: InputMaybe<Track_Bool_Exp>;
};


export type Subscription_RootWorkspaceArgs = {
  distinct_on?: InputMaybe<Array<Workspace_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Workspace_Order_By>>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};


export type Subscription_RootWorkspace_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWorkspace_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Workspace_Stream_Cursor_Input>>;
  where?: InputMaybe<Workspace_Bool_Exp>;
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

/** columns and relationships of "track" */
export type Track = {
  __typename?: 'track';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  deck: Deck;
  deck_id: Scalars['uuid'];
  id: Scalars['uuid'];
  ordering: Scalars['bigint'];
  /** An object relationship */
  single: Single;
  single_id: Scalars['uuid'];
};

/** order by aggregate values of table "track" */
export type Track_Aggregate_Order_By = {
  avg?: InputMaybe<Track_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Track_Max_Order_By>;
  min?: InputMaybe<Track_Min_Order_By>;
  stddev?: InputMaybe<Track_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Track_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Track_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Track_Sum_Order_By>;
  var_pop?: InputMaybe<Track_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Track_Var_Samp_Order_By>;
  variance?: InputMaybe<Track_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "track" */
export type Track_Arr_Rel_Insert_Input = {
  data: Array<Track_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Track_On_Conflict>;
};

/** order by avg() on columns of table "track" */
export type Track_Avg_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "track". All fields are combined with a logical 'AND'. */
export type Track_Bool_Exp = {
  _and?: InputMaybe<Array<Track_Bool_Exp>>;
  _not?: InputMaybe<Track_Bool_Exp>;
  _or?: InputMaybe<Array<Track_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deck?: InputMaybe<Deck_Bool_Exp>;
  deck_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ordering?: InputMaybe<Bigint_Comparison_Exp>;
  single?: InputMaybe<Single_Bool_Exp>;
  single_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "track" */
export enum Track_Constraint {
  /** unique or primary key constraint on columns "id" */
  TrackPkey = 'track_pkey'
}

/** input type for inserting data into table "track" */
export type Track_Insert_Input = {
  deck?: InputMaybe<Deck_Obj_Rel_Insert_Input>;
  deck_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  single_id?: InputMaybe<Scalars['uuid']>;
};

/** order by max() on columns of table "track" */
export type Track_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  single_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "track" */
export type Track_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  single_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "track" */
export type Track_Mutation_Response = {
  __typename?: 'track_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Track>;
};

/** on_conflict condition type for table "track" */
export type Track_On_Conflict = {
  constraint: Track_Constraint;
  update_columns?: Array<Track_Update_Column>;
  where?: InputMaybe<Track_Bool_Exp>;
};

/** Ordering options when selecting data from "track". */
export type Track_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deck?: InputMaybe<Deck_Order_By>;
  deck_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ordering?: InputMaybe<Order_By>;
  single?: InputMaybe<Single_Order_By>;
  single_id?: InputMaybe<Order_By>;
};

/** select columns of table "track" */
export enum Track_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeckId = 'deck_id',
  /** column name */
  Id = 'id',
  /** column name */
  Ordering = 'ordering',
  /** column name */
  SingleId = 'single_id'
}

/** order by stddev() on columns of table "track" */
export type Track_Stddev_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "track" */
export type Track_Stddev_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "track" */
export type Track_Stddev_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "track" */
export type Track_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Track_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Track_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deck_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  ordering?: InputMaybe<Scalars['bigint']>;
  single_id?: InputMaybe<Scalars['uuid']>;
};

/** order by sum() on columns of table "track" */
export type Track_Sum_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** placeholder for update columns of table "track" (current role has no relevant permissions) */
export enum Track_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER'
}

/** order by var_pop() on columns of table "track" */
export type Track_Var_Pop_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "track" */
export type Track_Var_Samp_Order_By = {
  ordering?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "track" */
export type Track_Variance_Order_By = {
  ordering?: InputMaybe<Order_By>;
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

/** columns and relationships of "workspace" */
export type Workspace = {
  __typename?: 'workspace';
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  decks: Array<Deck>;
  /** An array relationship */
  dirents: Array<Directory_Entry>;
  id: Scalars['uuid'];
  /** An array relationship */
  jobs: Array<Job>;
  name: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "workspace" */
export type WorkspaceDecksArgs = {
  distinct_on?: InputMaybe<Array<Deck_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Deck_Order_By>>;
  where?: InputMaybe<Deck_Bool_Exp>;
};


/** columns and relationships of "workspace" */
export type WorkspaceDirentsArgs = {
  distinct_on?: InputMaybe<Array<Directory_Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Directory_Entry_Order_By>>;
  where?: InputMaybe<Directory_Entry_Bool_Exp>;
};


/** columns and relationships of "workspace" */
export type WorkspaceJobsArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "workspace". All fields are combined with a logical 'AND'. */
export type Workspace_Bool_Exp = {
  _and?: InputMaybe<Array<Workspace_Bool_Exp>>;
  _not?: InputMaybe<Workspace_Bool_Exp>;
  _or?: InputMaybe<Array<Workspace_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  decks?: InputMaybe<Deck_Bool_Exp>;
  dirents?: InputMaybe<Directory_Entry_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  jobs?: InputMaybe<Job_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "workspace" */
export enum Workspace_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorkspacePkey = 'workspace_pkey'
}

/** input type for inserting data into table "workspace" */
export type Workspace_Insert_Input = {
  decks?: InputMaybe<Deck_Arr_Rel_Insert_Input>;
  dirents?: InputMaybe<Directory_Entry_Arr_Rel_Insert_Input>;
  jobs?: InputMaybe<Job_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
};

/** response of any mutation on the table "workspace" */
export type Workspace_Mutation_Response = {
  __typename?: 'workspace_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Workspace>;
};

/** input type for inserting object relation for remote table "workspace" */
export type Workspace_Obj_Rel_Insert_Input = {
  data: Workspace_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Workspace_On_Conflict>;
};

/** on_conflict condition type for table "workspace" */
export type Workspace_On_Conflict = {
  constraint: Workspace_Constraint;
  update_columns?: Array<Workspace_Update_Column>;
  where?: InputMaybe<Workspace_Bool_Exp>;
};

/** Ordering options when selecting data from "workspace". */
export type Workspace_Order_By = {
  created_at?: InputMaybe<Order_By>;
  decks_aggregate?: InputMaybe<Deck_Aggregate_Order_By>;
  dirents_aggregate?: InputMaybe<Directory_Entry_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  jobs_aggregate?: InputMaybe<Job_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: workspace */
export type Workspace_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "workspace" */
export enum Workspace_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "workspace" */
export type Workspace_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "workspace" */
export type Workspace_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Workspace_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Workspace_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "workspace" */
export enum Workspace_Update_Column {
  /** column name */
  Name = 'name'
}

export type Workspace_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Workspace_Set_Input>;
  where: Workspace_Bool_Exp;
};

export type TrackInfoFragment = { __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } };

export type DeckInfoFragment = { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> };

export type DecksQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type DecksQuery = { __typename?: 'query_root', workspace_by_pk?: { __typename?: 'workspace', id: string, decks: Array<{ __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> }> } | null };

export type StopDeckMutationVariables = Exact<{
  deckId: Scalars['uuid'];
}>;


export type StopDeckMutation = { __typename?: 'mutation_root', delete_deck_by_pk?: { __typename?: 'deck', id: string, workspace_id: string } | null };

export type UpdateDeckMutationVariables = Exact<{
  deckId: Scalars['uuid'];
  update: Deck_Set_Input;
}>;


export type UpdateDeckMutation = { __typename?: 'mutation_root', update_deck_by_pk?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> } | null };

export type PlayDeckMutationVariables = Exact<{
  workspaceId: Scalars['uuid'];
  deck: Deck_Insert_Input;
  isMain?: Scalars['Boolean'];
}>;


export type PlayDeckMutation = { __typename?: 'mutation_root', delete_track?: { __typename?: 'track_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'track', id: string }> } | null, insert_deck_one?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> } | null };

export type UpdateDeckAndSetQueueMutationVariables = Exact<{
  deckId: Scalars['uuid'];
  update: Deck_Set_Input;
  newQueue: Array<Track_Insert_Input> | Track_Insert_Input;
}>;


export type UpdateDeckAndSetQueueMutation = { __typename?: 'mutation_root', delete_track?: { __typename?: 'track_mutation_response', affected_rows: number } | null, insert_track?: { __typename?: 'track_mutation_response', affected_rows: number } | null, update_deck_by_pk?: { __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> } | null };

export type StopMainDeckMutationVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type StopMainDeckMutation = { __typename?: 'mutation_root', delete_deck?: { __typename?: 'deck_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'deck', id: string }> } | null };

export type UpdateMainDeckMutationVariables = Exact<{
  workspaceId: Scalars['uuid'];
  update: Deck_Set_Input;
}>;


export type UpdateMainDeckMutation = { __typename?: 'mutation_root', update_deck?: { __typename?: 'deck_mutation_response', returning: Array<{ __typename?: 'deck', id: string, type: Deck_Type_Enum_Enum, volume: number, speed: number, pause_timestamp?: string | null, start_timestamp: string, workspace_id: string, created_at: string, queue: Array<{ __typename?: 'track', id: string, created_at: string, deck_id: string, ordering: number, single: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } }> }> } | null };

export type SingleInfoFragment = { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } };

export type FileInfoFragment = { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any, single?: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } | null, folder?: { __typename?: 'folder', id: string } | null };

export type WorkspaceFilesQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceFilesQuery = { __typename?: 'query_root', directory_entry: Array<{ __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any, single?: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } | null, folder?: { __typename?: 'folder', id: string } | null }> };

export type UpdateDirectoryEntryMutationVariables = Exact<{
  id: Scalars['uuid'];
  update: Directory_Entry_Set_Input;
}>;


export type UpdateDirectoryEntryMutation = { __typename?: 'mutation_root', update_directory_entry_by_pk?: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any, single?: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } | null, folder?: { __typename?: 'folder', id: string } | null } | null };

export type UpdateSingleEntryMutationVariables = Exact<{
  id: Scalars['uuid'];
  update: Directory_Entry_Set_Input;
  desc: Scalars['String'];
}>;


export type UpdateSingleEntryMutation = { __typename?: 'mutation_root', update_single?: { __typename?: 'single_mutation_response', returning: Array<{ __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } }> } | null, update_directory_entry_by_pk?: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any, single?: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } | null, folder?: { __typename?: 'folder', id: string } | null } | null };

export type DeleteFileMutationVariables = Exact<{
  job: Delete_Job_Insert_Input;
}>;


export type DeleteFileMutation = { __typename?: 'mutation_root', insert_delete_job?: { __typename?: 'delete_job_mutation_response', affected_rows: number } | null };

export type MovePathMutationVariables = Exact<{
  workspaceId: Scalars['uuid'];
  oldpath: Scalars['jsonb'];
  newpath: Scalars['jsonb'];
}>;


export type MovePathMutation = { __typename?: 'mutation_root', update_directory_entry?: { __typename?: 'directory_entry_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any, single?: { __typename?: 'single', id: string, description: string, length: number, download_url: string, dirent: { __typename?: 'directory_entry', id: string, name: string, ordering?: number | null, path: any } } | null, folder?: { __typename?: 'folder', id: string } | null }> } | null };

export type DeleteFolderMutationVariables = Exact<{
  folderId: Scalars['uuid'];
}>;


export type DeleteFolderMutation = { __typename?: 'mutation_root', delete_directory_entry_by_pk?: { __typename?: 'directory_entry', id: string } | null };

export type CreateFolderMutationVariables = Exact<{
  name: Scalars['String'];
  path: Scalars['jsonb'];
  ordering?: InputMaybe<Scalars['bigint']>;
  workspaceId: Scalars['uuid'];
}>;


export type CreateFolderMutation = { __typename?: 'mutation_root', insert_folder_one?: { __typename?: 'folder', dirent: { __typename?: 'directory_entry', id: string, path: any, ordering?: number | null, name: string } } | null };

export type JobInfoFragment = { __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string };

export type WorkspaceJobsQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceJobsQuery = { __typename?: 'query_root', job: Array<{ __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string }> };

export type AddJobMutationVariables = Exact<{
  job: Job_Insert_Input;
}>;


export type AddJobMutation = { __typename?: 'mutation_root', insert_job_one?: { __typename?: 'job', id: string, url?: string | null, name: string, description: string, path: any, option_cut_start?: unknown | null, option_cut_end?: unknown | null, option_fade_in?: unknown | null, option_fade_out?: unknown | null, progress?: number | null, status: Job_Status_Enum_Enum, assigned_worker?: string | null, error?: string | null, created_at: string } | null };

export type DeleteErrorJobMutationVariables = Exact<{
  jobId: Scalars['uuid'];
}>;


export type DeleteErrorJobMutation = { __typename?: 'mutation_root', delete_job_by_pk?: { __typename?: 'job', id: string } | null };

export type WorkspaceInfoFragment = { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string };

export type WorkspaceDetailQueryVariables = Exact<{
  workspaceId: Scalars['uuid'];
}>;


export type WorkspaceDetailQuery = { __typename?: 'query_root', workspace_by_pk?: { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string } | null };

export type WorkspaceDetailByNameQueryVariables = Exact<{
  workspaceName: Scalars['String'];
}>;


export type WorkspaceDetailByNameQuery = { __typename?: 'query_root', workspace: Array<{ __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string }> };

export type CreateWorkspaceMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;


export type CreateWorkspaceMutation = { __typename?: 'mutation_root', insert_workspace_one?: { __typename?: 'workspace', id: string, name: string, created_at: string, updated_at: string } | null };

export const SingleInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"single"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"length"}},{"kind":"Field","name":{"kind":"Name","value":"download_url"}},{"kind":"Field","name":{"kind":"Name","value":"dirent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ordering"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<SingleInfoFragment, unknown>;
export const TrackInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"single"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deck_id"}},{"kind":"Field","name":{"kind":"Name","value":"ordering"}}]}}]} as unknown as DocumentNode<TrackInfoFragment, unknown>;
export const DeckInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"pause_timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"start_timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"queue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspace_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<DeckInfoFragment, unknown>;
export const FileInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"directory_entry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"single"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ordering"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]} as unknown as DocumentNode<FileInfoFragment, unknown>;
export const JobInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JobInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"job"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"option_cut_start"}},{"kind":"Field","name":{"kind":"Name","value":"option_cut_end"}},{"kind":"Field","name":{"kind":"Name","value":"option_fade_in"}},{"kind":"Field","name":{"kind":"Name","value":"option_fade_out"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"assigned_worker"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<JobInfoFragment, unknown>;
export const WorkspaceInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<WorkspaceInfoFragment, unknown>;
export const DecksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Decks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckInfo"}}]}}]}}]}},...DeckInfoFragmentDoc.definitions,...TrackInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<DecksQuery, DecksQueryVariables>;
export const StopDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_deck_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspace_id"}}]}}]}}]} as unknown as DocumentNode<StopDeckMutation, StopDeckMutationVariables>;
export const UpdateDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deck_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_deck_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckInfo"}}]}}]}},...DeckInfoFragmentDoc.definitions,...TrackInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<UpdateDeckMutation, UpdateDeckMutationVariables>;
export const PlayDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlayDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deck"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deck_insert_input"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isMain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"deck"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"main"}}]}}]}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isMain"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_deck_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deck"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckInfo"}}]}}]}},...DeckInfoFragmentDoc.definitions,...TrackInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<PlayDeckMutation, PlayDeckMutationVariables>;
export const UpdateDeckAndSetQueueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDeckAndSetQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deck_set_input"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newQueue"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"track_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"deck"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newQueue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_deck_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckInfo"}}]}}]}},...DeckInfoFragmentDoc.definitions,...TrackInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<UpdateDeckAndSetQueueMutation, UpdateDeckAndSetQueueMutationVariables>;
export const StopMainDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopMainDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_deck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"main"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<StopMainDeckMutation, StopMainDeckMutationVariables>;
export const UpdateMainDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMainDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deck_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_deck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"main"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckInfo"}}]}}]}}]}},...DeckInfoFragmentDoc.definitions,...TrackInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<UpdateMainDeckMutation, UpdateMainDeckMutationVariables>;
export const WorkspaceFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"directory_entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ordering"},"value":{"kind":"EnumValue","value":"asc_nulls_last"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}}]}},...FileInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<WorkspaceFilesQuery, WorkspaceFilesQueryVariables>;
export const UpdateDirectoryEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDirectoryEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"directory_entry_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_directory_entry_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}},{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}}]}},...FileInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<UpdateDirectoryEntryMutation, UpdateDirectoryEntryMutationVariables>;
export const UpdateSingleEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSingleEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"directory_entry_set_input"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_single"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"directory_entry_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleInfo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_directory_entry_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}},{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}}]}},...SingleInfoFragmentDoc.definitions,...FileInfoFragmentDoc.definitions]} as unknown as DocumentNode<UpdateSingleEntryMutation, UpdateSingleEntryMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"job"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"delete_job_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_delete_job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"job"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const MovePathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MovePath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldpath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newpath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_directory_entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldpath"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newpath"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}}]}}]}},...FileInfoFragmentDoc.definitions,...SingleInfoFragmentDoc.definitions]} as unknown as DocumentNode<MovePathMutation, MovePathMutationVariables>;
export const DeleteFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_directory_entry_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteFolderMutation, DeleteFolderMutationVariables>;
export const CreateFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ordering"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"bigint"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_folder_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dirent"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ordering"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ordering"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dirent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"ordering"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateFolderMutation, CreateFolderMutationVariables>;
export const WorkspaceJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"workspace_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assign_time"},"value":{"kind":"EnumValue","value":"asc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobInfo"}}]}}]}},...JobInfoFragmentDoc.definitions]} as unknown as DocumentNode<WorkspaceJobsQuery, WorkspaceJobsQueryVariables>;
export const AddJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"job"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"job_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_job_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"job"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobInfo"}}]}}]}},...JobInfoFragmentDoc.definitions]} as unknown as DocumentNode<AddJobMutation, AddJobMutationVariables>;
export const DeleteErrorJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteErrorJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_job_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteErrorJobMutation, DeleteErrorJobMutationVariables>;
export const WorkspaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceInfo"}}]}}]}},...WorkspaceInfoFragmentDoc.definitions]} as unknown as DocumentNode<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>;
export const WorkspaceDetailByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceDetailByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceName"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceInfo"}}]}}]}},...WorkspaceInfoFragmentDoc.definitions]} as unknown as DocumentNode<WorkspaceDetailByNameQuery, WorkspaceDetailByNameQueryVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_workspace_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceInfo"}}]}}]}},...WorkspaceInfoFragmentDoc.definitions]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;