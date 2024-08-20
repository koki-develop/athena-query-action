# Athena Query Action

[![GitHub Release](https://img.shields.io/github/v/release/koki-develop/athena-query-action)](https://github.com/koki-develop/athena-query-action/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/koki-develop/athena-query-action/ci.yml?branch=main&logo=github&style=flat&label=ci)](https://github.com/koki-develop/athena-query-action/actions/workflows/ci.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/koki-develop/athena-query-action/build.yml?branch=main&logo=github&style=flat&label=build)](https://github.com/koki-develop/athena-query-action/actions/workflows/build.yml)

Execute a query on Amazon Athena.

## Usage

```yaml
- uses: koki-develop/athena-query-action@v1
  with:
    query: SELECT * FROM my_table;
    output-location: s3://path/to/query/bucket/
```

### Inputs

| Name | Required | Description |
| ---- | -------- | ----------- |
| query | **Yes** | The SQL query statements to be executed. |
| database | No | The name of the database used in the query execution. The database must exist in the catalog. |
| catalog | No | The name of the data catalog used in the query execution. |
| output-location | No | The location in Amazon S3 where your query and calculation results are stored, such as `s3://path/to/query/bucket/`. |
| workgroup | No | The name of the workgroup in which the query is being started. |
| parameters | No | A list of values separated by commas for the parameters in a query. The values are applied sequentially to the parameters in the query in the order in which the parameters occur. |

### Outputs

| Name | Description |
| ---- | ----------- |
| execution-id | The unique ID of the query that ran as a result of this request. |
| output-location | The location in Amazon S3 where your query and calculation results are stored, such as `s3://path/to/query/bucket/00000000-0000-0000-0000-000000000000.csv`. |

## LICENSE

[MIT](./LICENSE)
