import React, { Component } from "react";
import { Button, Input, Select, DatePicker, Form, TreeSelect } from "antd";
import { initialValue } from "@/utils/form";
import moment from "moment/moment";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@Form.create()
class Search extends Component {
    static defaultProp = {
        loading: false,
        items: [],
        onSubmit: () => {
        },
        onReset: () => {

        },
        defaultValue: {}
    };

    render() {
        const { items, onSubmit, onReset, style } = this.props;
        let _items = [...items];
        if (typeof onSubmit === "function") {
            _items.push({
                submit: {}
            });
        }
        if (typeof onReset === "function") {
            _items.push({
                reset: {
                    onClick: onReset
                }
            });
        }
        return (
            <Form 
                layout="inline" 
                className="ant-advanced-search-form" 
                style={style ? style : {}}
                onSubmit={(e) => {
                    e.preventDefault();
                    this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                            // 过滤时间统一为时间戳
                            items.map((item) => {
                                if (typeof item["timeRange"] !== "undefined") {
                                    values[item.timeRange.field] = this.timeRangeToStamp(values[item.timeRange.field]);
                                }
                            });
                            onSubmit(values);
                        }
                    });
                }}
            >
                {
                    _items.map((item, index) => {
                        if (typeof item["input"] !== "undefined") {
                            return this.renders["input"](this.formatItem(item), index);
                        }
                        if (typeof item["select"] !== "undefined") {
                            return this.renders["select"](this.formatItem(item), index);
                        }
                        if (typeof item["selectInput"] !== "undefined") {
                            return this.renders["selectInput"](this.formatItem(item), index);
                        }
                        if (typeof item["timeRange"] !== "undefined") {
                            return this.renders["timeRange"](this.formatItem(item), index);
                        }
                        if (typeof item["treeSelect"] !== "undefined") {
                            return this.renders["treeSelect"](this.formatItem(item), index);
                        }
                        if (typeof item["submit"] !== "undefined") {
                            return this.renders["submit"](this.formatItem(item), index);
                        }
                        if (typeof item["reset"] !== "undefined") {
                            return this.renders["reset"](this.formatItem(item), index);
                        } else {
                            return null;
                        }
                    })
                }
            </Form>
        );
    }

    formatItem = (item) => {
        return item;
    };

    timeRangeToStamp(times) {
        if (times && Array.isArray(times) && times.length === 2) {
            times = [moment(times[0]).unix(), moment(times[1]).unix()];
        } else {
            times = [];
        }
        return times;
    }

    renders = {
        input: (item, index) => {
            const { getFieldDecorator } = this.props.form;
            let { input, label } = item;
            input = Object.assign({
                field: null,
                placeholder: null,
                onChange: (value) => {
                },
                initialValue: null
            }, input);

            return <FormItem label={label} key={index}>
                {getFieldDecorator(input.field, {
                    ...initialValue(input.initialValue)
                })(<Input
                    placeholder={input.placeholder}
                    onChange={(e) => {
                        input.onChange(e);
                    }}
                />)}
            </FormItem>;
        },
        select: (item, index) => {
            const { getFieldDecorator } = this.props.form;
            let { select, label } = item;

            select = Object.assign({
                field: null,
                style: null,
                placeholder: null,
                onChange: (value) => {
                },
                allowClear: true,
                initialValue: null
            }, select);

            return <FormItem label={label} key={index}>
                {getFieldDecorator(select.field, {
                    ...initialValue(select.initialValue)
                })(
                    <Select
                        placeholder={select.placeholder}
                        allowClear={select.allowClear}
                        style={select.style}
                        onChange={(e) => {
                            select.onChange(e);
                        }}
                    >
                        {select.data.map((op, opIndex) => {
                            return <Option value={op.value} key={opIndex}>{op.name}</Option>;
                        })}
                    </Select>
                )}
            </FormItem>;
        },
        selectInput: (item, index) => {
            const { getFieldDecorator } = this.props.form;
            let { selectInput, label } = item;
            const select = Object.assign({
                field: null,
                style: { minWidth: 115 },
                placeholder: null,
                onChange: (value) => {
                },
                initialValue: null,
                data: [
                    { name: "标题1", value: "value1" },
                    { name: "标题2", value: "value2" }
                ]
            }, selectInput[0]);

            const input = Object.assign({
                field: null,
                placeholder: null,
                onChange: (value) => {
                },
                initialValue: null
            }, selectInput[1]);


            const prefixSelector = getFieldDecorator(select.field, {
                ...initialValue(select.initialValue)
            })(<Select
                style={select.style}
                placeholder={select.placeholder}
                onChange={(e) => {
                    input.onChange(e);
                }}
            >
                {select.data.map((op, opIndex) => {
                    return <Option value={op.value} key={opIndex}>{op.name}</Option>;
                })}
            </Select>);
            return <FormItem label={label} key={index}>
                {getFieldDecorator(input.field, {
                    ...initialValue(input.initialValue)
                })(<Input
                    addonBefore={prefixSelector}
                    placeholder={input.placeholder}
                    onChange={(e) => {
                        input.onChange(e);
                    }}
                />)}
            </FormItem>;
        },
        timeRange: (item, index) => {
            const { getFieldDecorator } = this.props.form;
            let { timeRange, label } = item;

            timeRange = Object.assign({
                field: null,
                style: null,
                placeholder: null,
                onChange: (value) => {
                },
                allowClear: true,
                initialValue: null
            }, timeRange);

            if (Array.isArray(timeRange.initialValue) && timeRange.initialValue.length === 2) {
                timeRange.initialValue = [moment(parseInt(timeRange.initialValue[0] + "000")), moment(parseInt(timeRange.initialValue[1] + "000"))];
            }
            return <FormItem label={label} key={index}>
                {getFieldDecorator(timeRange.field, {
                    ...initialValue(timeRange.initialValue)
                })(
                    <RangePicker
                        allowClear={true}
                        onChange={(dates, create_time) => {
                            timeRange.onChange(dates, create_time);
                        }}
                    />
                )}
            </FormItem>;
        },
        treeSelect: (item, index) => {
            const { getFieldDecorator } = this.props.form;
            let { treeSelect, label } = item;

            treeSelect = Object.assign({
                field: null,
                style: null,
                dropdownStyle: null,
                placeholder: "请选择",
                multiple: false,
                treeDefaultExpandAll: false,
                treeData: [],
                onChange: (value) => {
                },
                allowClear: true,
                initialValue: null
            }, treeSelect);

            return <FormItem label={label} key={index}>
                {getFieldDecorator(treeSelect.field, {
                    ...initialValue(treeSelect.initialValue)
                })(
                    <TreeSelect
                        style={treeSelect.style}
                        dropdownStyle={treeSelect.dropdownStyle}
                        treeData={treeSelect.treeData}
                        placeholder={treeSelect.placeholder}
                        treeDefaultExpandAll={treeSelect.treeDefaultExpandAll}
                        allowClear={treeSelect.allowClear}
                        multiple={treeSelect.multiple}
                    />
                )}
            </FormItem>;
        },
        submit: (item, index) => {
            const { loading } = this.props;
            return <FormItem key={index}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    筛选
                </Button>
            </FormItem>;
        },
        reset: (item, index) => {
            const { defaultValue } = this.props;
            const { resetFields } = this.props.form;
            let { reset } = item;
            reset = Object.assign({
                onClick: () => {
                }
            }, reset);
            return <FormItem key={index}>
                <Button
                    onClick={() => {
                        resetFields(Object.keys(defaultValue));
                        reset.onClick(defaultValue);
                    }}
                >
                    清空筛选
                </Button>
            </FormItem>;
        }
    };
}

export default Search;
