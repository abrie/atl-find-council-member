package record

import (
	"fmt"
)

type TestSubmitter struct{}

func (s TestSubmitter) Submit(request *Request) (*Result, error) {
	switch request.Ref_ID {
	case 1:
		return &Result{Record{COUNCIL_DIST: "1", NPU_NAME: "A"}}, nil
	case 2:
		return &Result{Record{COUNCIL_DIST: "2", NPU_NAME: "B"}}, nil
	case 3:
		return &Result{Record{COUNCIL_DIST: "3", NPU_NAME: "C"}}, nil
	}

	return nil, fmt.Errorf("No data for Ref_ID=%d", request.Ref_ID)
}
