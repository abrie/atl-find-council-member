package censusgeocoder

import ()

type TestSubmitter struct{}

func (p TestSubmitter) Submit(request *Request) (*Result, error) {
	result := &Result{
		AddressMatches: []AddressMatch{
			AddressMatch{
				MatchedAddress: "123 Fake St",
				Coordinates:    Coordinates{X: 1, Y: 1},
			},
		},
	}

	return result, nil
}
