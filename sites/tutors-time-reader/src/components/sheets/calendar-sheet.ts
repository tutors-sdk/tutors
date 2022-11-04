import type { ICellRendererParams } from "ag-grid-community";
import type { Calendar } from "tutors-reader-lib/src/types/lo-types";
import type { UserMetric } from "tutors-reader-lib/src/types/metrics-types";
import { deepScheme } from "./heat-map-colours";
import { formatDate } from "tutors-reader-lib/src/utils/firebase-utils";

interface CalendarSheetColumn {
  headerName: string;
  field: string;
  width: number;
  suppressSizeToFit: boolean;
  pinned?: "left";
  cellRenderer?: (params: ICellRendererParams) => HTMLSpanElement;
  cellClassRules?: Record<string, string>;
  menuTabs?: [];
}

export const options = {
  animateRows: true,
  headerHeight: 120,
  defaultColDef: {
    sortable: true,
    resizable: true,
  },
  enableRangeSelection: true,
  enableCellChangeFlash: true,
  getRowId: function (data) {
    return data.github;
  },
  getRowHeight: function (params) {
    if (params.data.user) {
      return 60;
    }
    return 25;
  },
  getRowStyle: function (params) {
    if (params.data.user) {
      return { background: "#B2E3F1" };
    }
  },
};

export class CalendarSheet {
  title = "Tutors Time";
  subtitle = "Activity in the Semester";

  columnDefs: CalendarSheetColumn[] = [
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" },
    {
      headerName: "Github",
      field: "github",
      width: 80,
      suppressSizeToFit: true,
      cellRenderer: this.renderGithub,
    },
    { headerName: "Day", field: "date", width: 90, suppressSizeToFit: true },
  ];
  sortModel = [{ colId: "summary", sort: "dsc" }];
  rowData = [];

  renderGithub(params: ICellRendererParams) {
    if (params.value) {
      const nameElement = document.createElement("span");
      const a = document.createElement("a");
      const img = document.createElement("img");
      img.src = `http://github.com/${params.value}.png`;
      img.width = 120;
      a.append(img);
      a.title = params.value;
      a.href = `http://github.com/${params.value}`;
      a.setAttribute("target", "_blank");
      nameElement.appendChild(a);
      return nameElement;
    }
  }

  createUserIdRow(user: UserMetric) {
    const row = {
      user: user.name,
      github: user.nickname,
    };
    return row;
  }

  creatRow(user: UserMetric, day: number) {
    const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
    const row = {
      user: "",
      date: days[day],
      github: "",
    };
    return row;
  }

  render(grid) {
    if (grid) {
      const api = grid.gridOptions.api;
      api.setColumnDefs(this.columnDefs);
      api.setRowData(this.rowData);
    }
  }

  populateCols(calendar: Calendar) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (calendar) {
      calendar.weeks.forEach((week) => {
        const date = Date.parse(week.date);
        const dateStr = formatDate(date);
        this.columnDefs.push({
          headerName: `${week.title}: ${monthNames[week.dateObj.getMonth()]}`,
          width: 48,
          field: dateStr,
          suppressSizeToFit: true,
          cellClassRules: deepScheme,
          menuTabs: [],
        });
      });
    }
  }

  populateRow(user: UserMetric, calendar: Calendar) {
    this.rowData.push(this.createUserIdRow(user));
    for (let day = 0; day < 7; day++) {
      const row = this.creatRow(user, day);
      user.calendarActivity.forEach((measure) => {
        for (let i = 0; i < calendar.weeks.length - 1; i++) {
          if (measure.dateObj >= Date.parse(calendar.weeks[i].date) && measure.dateObj < Date.parse(calendar.weeks[i + 1].date)) {
            const col = formatDate(calendar.weeks[i].date);
            const date2 = measure.dateObj;
            const date1 = Date.parse(calendar.weeks[i].date);
            const differenceInTime = date2 - date1;
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays == day) {
              row[col] = Math.round(measure.metric / 2); // measure is in 30 second units - turn into minutes.
            }
          }
        }
      });
      this.rowData.push(row);
    }
    const row = this.creatRow(user, 8);
    this.rowData.push(row);
  }
}
